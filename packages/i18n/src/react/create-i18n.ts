import i18next, { type i18n as I18nInstance } from 'i18next';

import type { I18nOptions } from './types.js';

export function createI18n(options: I18nOptions): I18nInstance {
  const instance = i18next.createInstance();

  instance.init({
    lng: options.defaultLocale,
    fallbackLng: options.fallbackLocale ?? options.defaultLocale,
    ns: options.namespaces ?? ['common'],
    defaultNS: options.namespaces?.[0] ?? 'common',
    resources: options.resources
      ? Object.fromEntries(
          Object.entries(options.resources).map(([locale, namespaces]) => [locale, namespaces]),
        )
      : undefined,
    interpolation: { escapeValue: false },
  });

  return instance;
}
