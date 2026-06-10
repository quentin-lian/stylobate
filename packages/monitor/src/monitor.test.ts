import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MonitorError } from './errors.js';
import { createMonitor, type Monitor } from './monitor.js';
import type { SentryModule } from './types.js';

function createMockSentry(): SentryModule {
  return {
    init: vi.fn(),
    captureException: vi.fn().mockReturnValue('event-id-1'),
    captureMessage: vi.fn().mockReturnValue('event-id-2'),
    setUser: vi.fn(),
    setTag: vi.fn(),
    addBreadcrumb: vi.fn(),
  };
}

describe('Monitor', () => {
  let sentry: ReturnType<typeof createMockSentry>;
  let monitor: Monitor;

  beforeEach(() => {
    sentry = createMockSentry();
    monitor = createMonitor(
      { dsn: 'https://key@sentry.io/123', environment: 'test', release: '1.0.0' },
      sentry,
    );
  });

  it('initializes Sentry with provided options', () => {
    expect(sentry.init).toHaveBeenCalledWith({
      dsn: 'https://key@sentry.io/123',
      environment: 'test',
      release: '1.0.0',
      sampleRate: 1.0,
      tracesSampleRate: undefined,
      beforeSend: undefined,
    });
  });

  it('captures exceptions', () => {
    const error = new Error('test error');
    const eventId = monitor.captureException(error, { orderId: '456' });

    expect(eventId).toBe('event-id-1');
    expect(sentry.captureException).toHaveBeenCalledWith(error, { extra: { orderId: '456' } });
  });

  it('captures exceptions without context', () => {
    const error = new Error('bare');
    monitor.captureException(error);

    expect(sentry.captureException).toHaveBeenCalledWith(error, undefined);
  });

  it('captures messages with severity level', () => {
    const eventId = monitor.captureMessage('deploy started', 'warning');

    expect(eventId).toBe('event-id-2');
    expect(sentry.captureMessage).toHaveBeenCalledWith('deploy started', 'warning');
  });

  it('defaults message level to info', () => {
    monitor.captureMessage('hello');

    expect(sentry.captureMessage).toHaveBeenCalledWith('hello', 'info');
  });

  it('sets user context', () => {
    monitor.setUser({ id: 'u1', email: 'a@b.com' });

    expect(sentry.setUser).toHaveBeenCalledWith({ id: 'u1', email: 'a@b.com' });
  });

  it('clears user context with null', () => {
    monitor.setUser(null);

    expect(sentry.setUser).toHaveBeenCalledWith(null);
  });

  it('sets tags', () => {
    monitor.setTag('team', 'frontend');

    expect(sentry.setTag).toHaveBeenCalledWith('team', 'frontend');
  });

  it('adds breadcrumbs', () => {
    monitor.addBreadcrumb({ category: 'auth', message: 'User logged in', level: 'info' });

    expect(sentry.addBreadcrumb).toHaveBeenCalledWith({
      category: 'auth',
      message: 'User logged in',
      level: 'info',
    });
  });

  it('respects custom sampleRate', () => {
    const s = createMockSentry();
    createMonitor({ dsn: 'https://x@y.io/1', sampleRate: 0.5 }, s);

    expect(s.init).toHaveBeenCalledWith(expect.objectContaining({ sampleRate: 0.5 }));
  });
});

describe('MonitorError', () => {
  it('has correct name', () => {
    const err = new MonitorError('test');
    expect(err.name).toBe('MonitorError');
    expect(err.message).toBe('test');
  });
});
