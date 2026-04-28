import { Screen } from "@shared-ui/constants/state";
import { useLayoutEffect, useState } from "react";

export const useMatchMedia = (screen = Screen.lg) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useLayoutEffect(() => {
    const matchMedia = ({ matches }: MediaQueryList | MediaQueryListEvent) => {
      setIsDesktop(matches);
    };

    const mediaQueryList = window.matchMedia(`(min-width: ${screen}px)`);
    matchMedia(mediaQueryList);

    mediaQueryList.addEventListener("change", matchMedia);
    return () => mediaQueryList.removeEventListener("change", matchMedia);
  }, [screen]);

  return {
    isDesktop
  };
};
