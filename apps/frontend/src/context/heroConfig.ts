import type { IHeroContext } from "@interfaces/context/heroConfig";
import { createContext } from "react";

export const HeroConfigContext = createContext<IHeroContext>({
  horizontalFormOnDesktop: false
});

export const { Provider, Consumer } = HeroConfigContext;
