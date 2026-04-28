import type { WelcomeData } from "@interfaces/components/hero";
import { type FC, useContext } from "react";
import { SlideStyle } from "./style";
import {
  Button,
  Card,
  Icon,
  Typography,
  Constants,
  useMatchMedia
} from "@sitio-publico/shared-ui";
import clsx from "clsx";
import { useHeroSlide } from "@hooks/useHeroSlide";
import { useHeroSlideButton } from "@hooks/useHeroSlideButton";
import { isExternalHref } from "@lib/utils/links";
import { HeroConfigContext } from "@context/heroConfig";
import type { TMappedButton } from "@lib/helpers/mappers/button";

export const Slide: FC<WelcomeData> = ({
  features,
  subtitle,
  title,
  responsiveContent,
  backgroundImage,
  imageLoading = "lazy",
  imageFetchPriority = "auto",
  widget,
  ctaButton,
  ctaPosition
}) => {
  const { isDesktop } = useMatchMedia(Constants.Screen.md);
  const {
    horizontalFormOnDesktop,
    variant = "default",
    ctaPosition: contextCtaPosition = "side"
  } = useContext(HeroConfigContext);
  const { handlerCtaButton, handlerFeatureButton } = useHeroSlideButton();
  const resolvedCtaPosition = ctaPosition ?? contextCtaPosition;

  const currentContent = isDesktop
    ? responsiveContent?.desktop
    : responsiveContent?.mobile;
  const displayTitle = currentContent?.title ?? title;
  const displaySubtitle = currentContent?.subtitle ?? subtitle;
  const displayCtaButton = (currentContent?.ctaButton ?? ctaButton) as TMappedButton | undefined;
  const manualLink = currentContent?.useManualLink ? currentContent.link : undefined;
  const manualLinkTarget = currentContent?.isExternal ? "_blank" : undefined;
  const manualLinkRel = currentContent?.isExternal ? "noopener noreferrer" : undefined;

  const { imageSources, shouldShowOverlay, widgetComponent } = useHeroSlide({
    backgroundImage,
    widget,
    isDesktop
  });

  const {
    wrapper,
    container,
    content,
    textSection,
    titleStyle,
    subtitleStyle,
    featuresGrid,
    ctaMobileWrapper,
    ctaDesktopWrapper,
    ctaBelowDesktopWrapper,
    featureCard,
    featureText,
    formContainer,
    cardBase,
    backgroundLayer,
    backgroundImage: backgroundImageStyle
  } = SlideStyle({
    withOverlay: shouldShowOverlay,
    horizontalFormOnDesktop,
    variant,
    ctaPosition: resolvedCtaPosition
  });

  const isCtaExternal = isExternalHref(displayCtaButton?.href);
  const desktopImage = imageSources?.desktop;
  const currentImage = isDesktop ? imageSources?.desktop : imageSources?.mobile;

  const getCtaButtonClasses = () => {
    if (resolvedCtaPosition === "below") {
      return isDesktop
        ? "w-auto min-w-48 px-8"
        : "w-1/2 max-w-40 mx-auto";
    }
    return "w-1/2 max-w-40 mx-auto";
  };

  const ctaButtonProps = displayCtaButton
    ? {
        ...displayCtaButton,
        type: (displayCtaButton.href ? "link" : (displayCtaButton.type ?? "button")) as "link" | "button" | "submit",
        target: isCtaExternal ? "_blank" : displayCtaButton.target,
        onClick: handlerCtaButton(displayCtaButton),
        className: {
          base: clsx(displayCtaButton.className?.base, getCtaButtonClasses())
        }
      }
    : undefined;

  const slideContent = (
    <>
      {currentImage && (
        <picture className={backgroundLayer()} aria-hidden>
          {desktopImage && (
            <source
              media={`(min-width: ${Constants.Screen.lg}px)`}
              srcSet={desktopImage}
            />
          )}
          <img
            className={backgroundImageStyle()}
            src={currentImage}
            sizes="100vw"
            alt=""
            loading={imageLoading}
            fetchPriority={imageFetchPriority}
            decoding="async"
          />
        </picture>
      )}
      <div className={container({ withOverlay: shouldShowOverlay })}>
        <div className={content()}>
          <div className={textSection()}>
            <Typography
              tag={displayTitle.tag}
              variant={isDesktop ? "hero" : "h1"}
              type="regular"
              className={{ base: titleStyle() }}
            >
              {displayTitle.text}
            </Typography>
            <Typography
              tag={displaySubtitle.tag}
              variant={isDesktop ? "h2" : "h3"}
              type="regular"
              className={{ base: subtitleStyle() }}
            >
              {displaySubtitle.text}
            </Typography>
            {ctaButtonProps && resolvedCtaPosition === "below" && (
              <div className={ctaMobileWrapper()}>
                <Button {...ctaButtonProps} />
              </div>
            )}
            {ctaButtonProps && resolvedCtaPosition === "below" && (
              <div className={ctaBelowDesktopWrapper()}>
                <Button {...ctaButtonProps} />
              </div>
            )}
            {ctaButtonProps && resolvedCtaPosition === "side" && (
              <div className={ctaMobileWrapper()}>
                <Button {...ctaButtonProps} />
              </div>
            )}
            <div className={featuresGrid()} data-hero-features>
              {features.map((feature, index) => {
                const isExternal = isExternalHref(feature.href);
                const hasAction = feature.identifier !== undefined && !feature.href;
                return (
                  <Card
                    key={`${index}-${feature.name}`}
                    backgroundColor={"none"}
                    border={"white"}
                    href={feature.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    ariaLabel={feature.text}
                    onClick={hasAction ? handlerFeatureButton(feature) : undefined}
                    className={{
                      base: cardBase()
                    }}
                  >
                    <div className={featureCard()}>
                      <Icon name={feature.name} />
                      <div className={featureText()}>{feature.text}</div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          {ctaButtonProps && resolvedCtaPosition === "side" && (
            <div className={ctaDesktopWrapper()}>
              <Button {...ctaButtonProps} />
            </div>
          )}
          {widgetComponent && !horizontalFormOnDesktop && (
            <div className={formContainer()}>{widgetComponent}</div>
          )}
        </div>
      </div>
    </>
  );

  if (manualLink) {
    return (
      <a
        href={manualLink}
        target={manualLinkTarget}
        rel={manualLinkRel}
        className={`${wrapper()} block`}
      >
        {slideContent}
      </a>
    );
  }

  return <div className={wrapper()}>{slideContent}</div>;
};
