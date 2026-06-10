import { createI18n as createVueI18n, type I18n } from 'vue-i18n';

import type { I18nOptions } from './types.js';

export type VueI18nInstance = I18n;

export function createI18nPlugin(options: I18nOptions): I18n {
  const messages: Record<string, Record<string, string>> = {};

  if (options.resources) {
    for (const [locale, namespaces] of Object.entries(options.resources)) {
      const flat: Record<string, string> = {};
      for (const [ns, keys] of Object.entries(namespaces)) {
        for (const [key, value] of Object.entries(keys)) {
          flat[ns === (options.namespaces?.[0] ?? 'common') ? key : `${ns}.${key}`] = value;
        }
      }
      messages[locale] = flat;
    }
  }

  return createVueI18n({
    legacy: false,
    locale: options.defaultLocale,
    fallbackLocale: options.fallbackLocale ?? options.defaultLocale,
    messages,
  });
}
