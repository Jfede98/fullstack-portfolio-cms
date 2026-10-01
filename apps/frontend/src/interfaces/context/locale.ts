export type Locale = "es" | "en";

export interface ILocaleContext {
  locale: Locale;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
}
