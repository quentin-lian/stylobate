export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'info' | 'debug';

export interface MonitorUser {
  id: string;
  email?: string;
  username?: string;
  [key: string]: unknown;
}

export interface Breadcrumb {
  category?: string;
  message?: string;
  level?: SeverityLevel;
  data?: Record<string, unknown>;
}

export interface MonitorOptions {
  dsn: string;
  environment?: string;
  release?: string;
  sampleRate?: number;
  tracesSampleRate?: number;
  beforeSend?: (event: unknown) => unknown | null;
}

export interface SentryModule {
  init(options: Record<string, unknown>): void;
  captureException(error: unknown, context?: Record<string, unknown>): string;
  captureMessage(message: string, level?: string): string;
  setUser(user: Record<string, unknown> | null): void;
  setTag(key: string, value: string): void;
  addBreadcrumb(breadcrumb: Record<string, unknown>): void;
}
