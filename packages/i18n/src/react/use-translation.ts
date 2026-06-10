import { useTranslation as useI18nextTranslation } from 'react-i18next';

import type { TranslationResult } from './types.js';

export function useTranslation(ns?: string): TranslationResult {
  const { t, i18n } = useI18nextTranslation(ns);

  return {
    t: (key: string, params?: Record<string, string>) => t(key, params),
    locale: i18n.language,
    setLocale: (locale: string) => {
      void i18n.changeLanguage(locale);
    },
  };
}
