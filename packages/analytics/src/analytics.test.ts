import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Analytics, createAnalytics } from './analytics.js';
import { AnalyticsError } from './errors.js';
import type { AnalyticsAdapter } from './types.js';

function createMockAdapter(): AnalyticsAdapter & { flush: ReturnType<typeof vi.fn> } {
  return {
    track: vi.fn(),
    identify: vi.fn(),
    page: vi.fn(),
    group: vi.fn(),
    flush: vi.fn(),
  };
}

describe('Analytics', () => {
  let adapter: ReturnType<typeof createMockAdapter>;
  let analytics: Analytics;

  beforeEach(() => {
    vi.useFakeTimers();
    adapter = createMockAdapter();
    analytics = createAnalytics({ adapter, batchSize: 3, flushInterval: 1000 });
  });

  afterEach(() => {
    analytics.destroy();
    vi.useRealTimers();
  });

  it('tracks events', async () => {
    analytics.track('button_clicked', { label: 'submit' });
    await analytics.flush();

    expect(adapter.track).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'track',
        name: 'button_clicked',
        properties: { label: 'submit' },
      }),
    );
  });

  it('identifies users', async () => {
    analytics.identify('user-1', { plan: 'pro' });
    await analytics.flush();

    expect(adapter.identify).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'identify',
        userId: 'user-1',
        traits: { plan: 'pro' },
      }),
    );
  });

  it('attaches userId to subsequent events after identify', async () => {
    analytics.identify('user-1');
    analytics.track('click');
    await analytics.flush();

    expect(adapter.track).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-1' }));
  });

  it('tracks page views', async () => {
    analytics.page('/dashboard', { referrer: '/home' });
    await analytics.flush();

    expect(adapter.page).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'page',
        path: '/dashboard',
        properties: { referrer: '/home' },
      }),
    );
  });

  it('tracks group events', async () => {
    analytics.identify('u1');
    analytics.group('org-456', { name: 'Acme' });
    await analytics.flush();

    expect(adapter.group).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'group',
        groupId: 'org-456',
        traits: { name: 'Acme' },
        userId: 'u1',
      }),
    );
  });

  it('auto-flushes when batch size is reached', async () => {
    analytics.track('a');
    analytics.track('b');
    analytics.track('c');

    await vi.advanceTimersByTimeAsync(0);

    expect(adapter.track).toHaveBeenCalledTimes(3);
  });

  it('auto-flushes on interval', async () => {
    analytics.track('delayed');

    await vi.advanceTimersByTimeAsync(1000);

    expect(adapter.track).toHaveBeenCalledTimes(1);
  });

  it('calls adapter.flush on flush()', async () => {
    await analytics.flush();

    expect(adapter.flush).toHaveBeenCalled();
  });

  it('throws after destroy', () => {
    analytics.destroy();

    expect(() => analytics.track('x')).toThrow(AnalyticsError);
    expect(() => analytics.track('x')).toThrow('destroyed');
  });

  it('createAnalytics returns an Analytics instance', () => {
    const a = createAnalytics({ adapter, flushInterval: 0 });
    expect(a).toBeInstanceOf(Analytics);
    a.destroy();
  });
});

describe('AnalyticsError', () => {
  it('has correct name', () => {
    const err = new AnalyticsError('test');
    expect(err.name).toBe('AnalyticsError');
    expect(err.message).toBe('test');
  });
});
