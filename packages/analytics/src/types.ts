export interface TrackEvent {
  type: 'track';
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  anonymousId?: string;
}

export interface IdentifyEvent {
  type: 'identify';
  userId: string;
  traits?: Record<string, unknown>;
  timestamp: number;
}

export interface PageEvent {
  type: 'page';
  path: string;
  properties?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  anonymousId?: string;
}

export interface GroupEvent {
  type: 'group';
  groupId: string;
  traits?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
}

export type AnalyticsEvent = TrackEvent | IdentifyEvent | PageEvent | GroupEvent;

export interface AnalyticsAdapter {
  track(event: TrackEvent): Promise<void> | void;
  identify(event: IdentifyEvent): Promise<void> | void;
  page(event: PageEvent): Promise<void> | void;
  group(event: GroupEvent): Promise<void> | void;
  flush?(): Promise<void> | void;
}

export interface AnalyticsOptions {
  adapter: AnalyticsAdapter;
  batchSize?: number;
  flushInterval?: number;
}
