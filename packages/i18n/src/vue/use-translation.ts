import { useI18n } from 'vue-i18n';

import type { TranslationResult } from './types.js';

export function useTranslation(_ns?: string): TranslationResult {
  const { t, locale } = useI18n();

  return {
    t: (key: string, params?: Record<string, string>) => (params ? t(key, params) : t(key)),
    locale: locale.value,
    setLocale: (newLocale: string) => {
      locale.value = newLocale;
    },
  };
}
