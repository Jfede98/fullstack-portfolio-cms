import { createContext, useContext } from "react";
import type { ILocaleContext } from "@interfaces/context/locale";

export const LocaleContext = createContext<ILocaleContext>({
  locale: "es",
  toggleLocale: () => {},
  setLocale: () => {}
});

export const { Provider: LocaleProvider, Consumer: LocaleConsumer } =
  LocaleContext;

export const useLocale = (): ILocaleContext => useContext(LocaleContext);
