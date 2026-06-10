import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { createI18n } from './create-i18n.js';
import { I18nProvider } from './provider.js';
import { useTranslation } from './use-translation.js';

const resources = {
  'zh-CN': { common: { welcome: '你好 {{name}}', hello: '你好世界' } },
  en: { common: { welcome: 'Hello {{name}}', hello: 'Hello World' } },
};

function TestComponent() {
  const { t, locale } = useTranslation('common');
  return (
    <div>
      <span data-testid="greeting">{t('hello')}</span>
      <span data-testid="interpolated">{t('welcome', { name: 'Test' })}</span>
      <span data-testid="locale">{locale}</span>
    </div>
  );
}

describe('React i18n', () => {
  afterEach(() => {
    cleanup();
  });

  it('translates keys with default locale', () => {
    const i18n = createI18n({
      defaultLocale: 'zh-CN',
      fallbackLocale: 'en',
      namespaces: ['common'],
      resources,
    });

    render(
      <I18nProvider i18n={i18n}>
        <TestComponent />
      </I18nProvider>,
    );

    expect(screen.getByTestId('greeting').textContent).toBe('你好世界');
    expect(screen.getByTestId('locale').textContent).toBe('zh-CN');
  });

  it('interpolates parameters', () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      namespaces: ['common'],
      resources,
    });

    render(
      <I18nProvider i18n={i18n}>
        <TestComponent />
      </I18nProvider>,
    );

    expect(screen.getByTestId('interpolated').textContent).toBe('Hello Test');
  });

  it('falls back to fallback locale for missing keys', () => {
    const i18n = createI18n({
      defaultLocale: 'zh-CN',
      fallbackLocale: 'en',
      namespaces: ['common'],
      resources: {
        'zh-CN': { common: {} },
        en: { common: { hello: 'Hello World' } },
      },
    });

    render(
      <I18nProvider i18n={i18n}>
        <TestComponent />
      </I18nProvider>,
    );

    expect(screen.getByTestId('greeting').textContent).toBe('Hello World');
  });
});
