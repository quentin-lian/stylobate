export interface I18nOptions {
  defaultLocale: string;
  fallbackLocale?: string;
  namespaces?: string[];
  resources?: Record<string, Record<string, Record<string, string>>>;
}

export interface TranslationResult {
  t: (key: string, params?: Record<string, string>) => string;
  locale: string;
  setLocale: (locale: string) => void;
}
