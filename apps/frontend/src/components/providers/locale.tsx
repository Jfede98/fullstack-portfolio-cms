"use client";

import { useState, useCallback, type FC } from "react";
import type { TProvider } from "@interfaces/provider";
import type { Locale } from "@interfaces/context/locale";
import { LocaleContext } from "@context/locale";

export const LocaleProviderWrapper: FC<TProvider> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>("es");

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === "es" ? "en" : "es"));
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};
