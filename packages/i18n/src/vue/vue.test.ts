import { describe, expect, it } from 'vitest';

import { createI18nPlugin } from './create-i18n.js';

const resources = {
  'zh-CN': { common: { welcome: '你好 {name}', hello: '你好世界' } },
  en: { common: { welcome: 'Hello {name}', hello: 'Hello World' } },
};

describe('Vue i18n', () => {
  it('creates i18n instance with correct locale', () => {
    const i18n = createI18nPlugin({
      defaultLocale: 'zh-CN',
      fallbackLocale: 'en',
      namespaces: ['common'],
      resources,
    });

    expect(i18n.global.locale).toBeDefined();
  });

  it('translates keys via global t()', () => {
    const i18n = createI18nPlugin({
      defaultLocale: 'zh-CN',
      namespaces: ['common'],
      resources,
    });

    const t = i18n.global.t;
    expect(t('hello')).toBe('你好世界');
  });

  it('interpolates parameters', () => {
    const i18n = createI18nPlugin({
      defaultLocale: 'en',
      namespaces: ['common'],
      resources,
    });

    const t = i18n.global.t;
    expect(t('welcome', { name: 'Test' })).toBe('Hello Test');
  });

  it('falls back to fallback locale', () => {
    const i18n = createI18nPlugin({
      defaultLocale: 'zh-CN',
      fallbackLocale: 'en',
      namespaces: ['common'],
      resources: {
        'zh-CN': { common: {} },
        en: { common: { hello: 'Hello World' } },
      },
    });

    const t = i18n.global.t;
    expect(t('hello')).toBe('Hello World');
  });
});
