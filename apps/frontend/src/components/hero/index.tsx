"use client";

import type { HeroProps } from "@interfaces/components/hero";
import { type FC, useRef } from "react";
import { HeroStyle } from "./style";
import { Carousel, useMatchMedia } from "@sitio-publico/shared-ui";
import { useHero } from "@hooks/useHero";
import { Slide } from "./slide";
import { useHeroFeatureWrap } from "@hooks/useHeroFeatureWrap";
import { Provider as HeroConfigProvider } from "@context/heroConfig";
import type { ICarouselProps } from "@shared-ui/interfaces/carousel";

export const Hero: FC<HeroProps> = ({
  slides,
  avatars,
  labels,
  widget,
  isFormWidget,
  showWidgetOnDesktop,
  horizontalFormOnDesktop,
  autoSlideDelayMs = 5000,
  variant = "default",
  ctaPosition = "below"
}) => {
  if (!slides.length) return null;

  const {
    data,
    handleSlideChange,
    handleInit,
    navigationLabel,
    avatarGroup,
    widgetComponent
  } = useHero({ slides, avatars, labels, widget });

  const headerRef = useRef<HTMLElement>(null);
  const { isDesktop } = useMatchMedia();
  const { wrapped, updateWrap } = useHeroFeatureWrap(headerRef, !isDesktop);

  const handleInitWithWrap = (swiper: Parameters<typeof handleInit>[0]) => {
    handleInit(swiper);
    updateWrap();
  };

  const handleSlideChangeWithWrap = (
    swiper: Parameters<typeof handleSlideChange>[0]
  ) => {
    handleSlideChange(swiper);
    updateWrap();
  };

  const {
    base,
    mobileFormContainer,
    mobileFormWrapper,
    navigationContainer,
    swiperContainer,
    paginationContainer
  } = HeroStyle({
    existWidget: !!widget,
    extraMobileHeight: wrapped,
    showWidgetOnDesktop,
    formWidget: isFormWidget,
    horizontalFormOnDesktop
  });

  const shouldShowNavigation = slides.length > 1 && !horizontalFormOnDesktop;
  const navigationProp: ICarouselProps["navigation"] = shouldShowNavigation
    ? {
        type: "avatars",
        text: navigationLabel,
        className: {
          base: navigationContainer()
        },
        avatarGroup: {
          size: "sm",
          border: true,
          animation: true,
          avatars: avatarGroup ?? []
        }
      }
    : undefined;

  return (
    <HeroConfigProvider value={{ horizontalFormOnDesktop, variant, ctaPosition }}>
      <header className={base()} role="banner" ref={headerRef}>
        <Carousel
          loop
          Element={Slide}
          data={data}
          disabledAnimationSlide={false}
          pagination={slides.length > 1 ? { duration: autoSlideDelayMs } : undefined}
          on={{
            init: handleInitWithWrap,
            slideChange: handleSlideChangeWithWrap
          }}
          className={{
            pagination: paginationContainer(),
            slide: swiperContainer()
          }}
          navigation={navigationProp}
        />

        {widgetComponent && (
          <div className={mobileFormContainer()}>
            <div className={mobileFormWrapper()}>{widgetComponent}</div>
          </div>
        )}
      </header>
    </HeroConfigProvider>
  );
};
