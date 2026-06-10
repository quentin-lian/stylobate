import { MonitorError } from './errors.js';
import type {
  Breadcrumb,
  MonitorOptions,
  MonitorUser,
  SentryModule,
  SeverityLevel,
} from './types.js';

export class Monitor {
  private sentry: SentryModule;
  private initialized = false;

  constructor(options: MonitorOptions, sentry: SentryModule) {
    this.sentry = sentry;
    this.sentry.init({
      dsn: options.dsn,
      environment: options.environment,
      release: options.release,
      sampleRate: options.sampleRate ?? 1.0,
      tracesSampleRate: options.tracesSampleRate,
      beforeSend: options.beforeSend,
    });
    this.initialized = true;
  }

  captureException(error: unknown, context?: Record<string, unknown>): string {
    this.assertInitialized();
    return this.sentry.captureException(error, context ? { extra: context } : undefined);
  }

  captureMessage(message: string, level: SeverityLevel = 'info'): string {
    this.assertInitialized();
    return this.sentry.captureMessage(message, level);
  }

  setUser(user: MonitorUser | null): void {
    this.assertInitialized();
    this.sentry.setUser(user);
  }

  setTag(key: string, value: string): void {
    this.assertInitialized();
    this.sentry.setTag(key, value);
  }

  addBreadcrumb(breadcrumb: Breadcrumb): void {
    this.assertInitialized();
    this.sentry.addBreadcrumb({ ...breadcrumb });
  }

  private assertInitialized(): void {
    if (!this.initialized) {
      throw new MonitorError('Monitor has not been initialized');
    }
  }
}

export function createMonitor(options: MonitorOptions, sentry: SentryModule): Monitor {
  return new Monitor(options, sentry);
}
