import { WelcomeData } from "@interfaces/components/hero";
import { useMemo } from "react";

type HeroProps = Pick<WelcomeData, "backgroundImage" | "widget"> & {
  isDesktop: boolean;
};
export const useHeroSlide = ({ backgroundImage, widget, isDesktop }: HeroProps) => {
  const widgetComponent = useMemo(() => widget, [widget]);

  const imageSources = useMemo(() => {
    if (!backgroundImage) return undefined;
    return {
      desktop: backgroundImage.desktop,
      mobile: backgroundImage.mobile
    };
  }, [backgroundImage]);

  const shouldShowOverlay = isDesktop
    ? (backgroundImage?.enableOverlayDesktop ?? true)
    : (backgroundImage?.enableOverlayMobile ?? true);

  return { imageSources, shouldShowOverlay, widgetComponent };
};
