import { AnalyticsError } from './errors.js';
import type {
  AnalyticsAdapter,
  AnalyticsEvent,
  AnalyticsOptions,
  GroupEvent,
  IdentifyEvent,
  PageEvent,
  TrackEvent,
} from './types.js';

export class Analytics {
  private adapter: AnalyticsAdapter;
  private queue: AnalyticsEvent[] = [];
  private batchSize: number;
  private flushInterval: number;
  private timer: ReturnType<typeof setInterval> | null = null;
  private userId: string | undefined;
  private destroyed = false;

  constructor(options: AnalyticsOptions) {
    this.adapter = options.adapter;
    this.batchSize = options.batchSize ?? 10;
    this.flushInterval = options.flushInterval ?? 5000;

    if (this.flushInterval > 0) {
      this.timer = setInterval(() => void this.flush(), this.flushInterval);
    }
  }

  identify(userId: string, traits?: Record<string, unknown>): void {
    this.assertNotDestroyed();
    this.userId = userId;
    const event: IdentifyEvent = {
      type: 'identify',
      userId,
      traits,
      timestamp: Date.now(),
    };
    this.enqueue(event);
  }

  track(name: string, properties?: Record<string, unknown>): void {
    this.assertNotDestroyed();
    const event: TrackEvent = {
      type: 'track',
      name,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
    };
    this.enqueue(event);
  }

  page(path: string, properties?: Record<string, unknown>): void {
    this.assertNotDestroyed();
    const event: PageEvent = {
      type: 'page',
      path,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
    };
    this.enqueue(event);
  }

  group(groupId: string, traits?: Record<string, unknown>): void {
    this.assertNotDestroyed();
    const event: GroupEvent = {
      type: 'group',
      groupId,
      traits,
      timestamp: Date.now(),
      userId: this.userId,
    };
    this.enqueue(event);
  }

  async flush(): Promise<void> {
    this.assertNotDestroyed();
    const events = this.queue.splice(0);
    for (const event of events) {
      await this.dispatch(event);
    }
    await this.adapter.flush?.();
  }

  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.destroyed = true;
  }

  private enqueue(event: AnalyticsEvent): void {
    this.queue.push(event);
    if (this.queue.length >= this.batchSize) {
      void this.flush();
    }
  }

  private async dispatch(event: AnalyticsEvent): Promise<void> {
    switch (event.type) {
      case 'track':
        await this.adapter.track(event);
        break;
      case 'identify':
        await this.adapter.identify(event);
        break;
      case 'page':
        await this.adapter.page(event);
        break;
      case 'group':
        await this.adapter.group(event);
        break;
    }
  }

  private assertNotDestroyed(): void {
    if (this.destroyed) {
      throw new AnalyticsError('Analytics instance has been destroyed');
    }
  }
}

export function createAnalytics(options: AnalyticsOptions): Analytics {
  return new Analytics(options);
}
