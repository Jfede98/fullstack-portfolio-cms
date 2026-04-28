import type { TMediaImage, TWidget } from "@interfaces/lib/strapi/modules";
import { mapUrlMedia } from "./utils";
import type {
  BackgroundImage,
  FeatureData,
  HeroSlideData,
  HeroProps,
  StrapiHero,
  StrapiHeroFeatureClick,
  StrapiHeroIcon,
  StrapiHeroSlide
} from "@interfaces/components/hero";
import { buildWidget } from "../buildWidget";
import { mapperForm } from "./form";
import { createElement } from "react";
import { FormBlock } from "@components/forms/contact/block";
import type { ILeadFormSelection } from "@interfaces/coverageForm";
import { selectCurrentRoutingConfig } from "@lib/helpers/routingConfig";
import { mapSharedBanner, type MappedSharedBanner } from "./banner";
import { mapButtonIdentifier, mapLeadFormSelection } from "./button";

const getMediaUrl = (media?: TMediaImage): string | undefined =>
  mapUrlMedia(media ?? null);

const getIconName = (icon?: StrapiHeroIcon): string | undefined => icon?.name;

const getFeatureText = (feature: StrapiHeroFeatureClick): string =>
  feature.description ?? feature.button?.label ?? "";

const getFeatureIdentifier = (feature: StrapiHeroFeatureClick): number | undefined => {
  const identifier = feature.button?.identifier;
  return identifier ? mapButtonIdentifier(identifier) : undefined;
};

const mapBackgroundImage = (
  mappedBanner: MappedSharedBanner
): BackgroundImage | undefined => {
  const desktop = mappedBanner.desktop.image;
  const mobile = mappedBanner.mobile.image;

  if (!desktop && !mobile) return undefined;

  return {
    desktop,
    mobile,
    enableOverlayDesktop: mappedBanner.desktop.enableOverlay,
    enableOverlayMobile: mappedBanner.mobile.enableOverlay
  };
};

const buildWidgetComponent = (blockWidget?: TWidget, id = 0) => {
  if (!blockWidget) return null;
  const block = { id, widget: blockWidget } as unknown as TWidget;

  return buildWidget({
    block,
    key: `widget-${id}`
  });
};

const buildLeadFormComponent = (
  leadForm?: StrapiHeroSlide["lead_form"],
  id = 0
) => {
  if (!leadForm?.form) return null;
  const mappedForm = mapperForm(leadForm.form);
  const activeRoutingConfig = selectCurrentRoutingConfig(
    leadForm.lead_routing_configs
  );
  const leadSelection: ILeadFormSelection = {
    leadFormDocumentId: leadForm.documentId,
    leadFormName: leadForm.name,
    channel: leadForm.channel,
    automaticFlow: leadForm.automaticFlow ?? false,
    form: mappedForm,
    routingConfigDocumentId: activeRoutingConfig?.documentId,
    distributionMode: activeRoutingConfig?.distributionMode
  };

  return createElement(FormBlock, {
    ...mappedForm,
    leadSelection,
    key: `lead-form-${id}`
  });
};

const mapSlide = (slide: StrapiHeroSlide) => {
  const mappedBanner = mapSharedBanner(slide.banner);

  const validFeatures = (slide.features ?? []).filter((feature) => {
    const icon = feature.button?.icon as StrapiHeroIcon | undefined;
    const iconName = getIconName(icon);
    const text = getFeatureText(feature);
    return Boolean(iconName || text);
  });

  const features: FeatureData[] = validFeatures.map((feature) => ({
    name: getIconName(feature.button?.icon as StrapiHeroIcon) ?? "",
    text: getFeatureText(feature),
    href: feature.button?.href || undefined,
    identifier: getFeatureIdentifier(feature),
    leadFormSelection: mapLeadFormSelection(feature.button)
  }));

  const widgetComponent = buildLeadFormComponent(slide?.lead_form, slide.id);
  return {
    id: slide.id,
    navigationText: slide.navigationLabel ?? "",
    content: {
      title: mappedBanner.desktop.title,
      subtitle: mappedBanner.desktop.subtitle,
      responsiveContent: {
        desktop: {
          title: mappedBanner.desktop.title,
          subtitle: mappedBanner.desktop.subtitle,
          ctaButton: mappedBanner.desktop.ctaButton,
          useManualLink: mappedBanner.desktop.useManualLink,
          link: mappedBanner.desktop.link,
          isExternal: mappedBanner.desktop.isExternal
        },
        mobile: {
          title: mappedBanner.mobile.title,
          subtitle: mappedBanner.mobile.subtitle,
          ctaButton: mappedBanner.mobile.ctaButton,
          useManualLink: mappedBanner.mobile.useManualLink,
          link: mappedBanner.mobile.link,
          isExternal: mappedBanner.mobile.isExternal
        }
      },
      features,
      ctaPosition: mappedBanner.ctaPosition,
      widget: widgetComponent,
      ctaButton: mappedBanner.desktop.ctaButton,
      backgroundImage: mapBackgroundImage(mappedBanner)
    }
  };
};

export const mapHero = (data: StrapiHero): HeroProps => {
  const slides: HeroSlideData[] = [];
  const avatars: NonNullable<HeroProps["avatars"]> = [];
  const labels: NonNullable<HeroProps["labels"]> = [];
  const list = data?.slides ?? [];
  const overlaySource = data?.heroOverlaySource;
  const widget =
    overlaySource === "widget"
      ? buildWidgetComponent(data?.overlayWidget, data.id)
      : overlaySource === "lead_form"
        ? buildLeadFormComponent(data?.overlayLeadForm, data.id)
        : null;

  for (const currentSlide of list) {
    const { avatar, navigationLabel } = currentSlide;
    slides.push(mapSlide(currentSlide));
    labels.push(navigationLabel ?? "");

    if (!avatar) continue;
    const avatarUrl = getMediaUrl(avatar);
    avatars.push({ src: avatarUrl ?? "" });
  }

  return {
    slides,
    avatars,
    labels,
    widget,
    isFormWidget: overlaySource === "lead_form",
    showWidgetOnDesktop: data?.showWidgetOnDesktop ?? false,
    horizontalFormOnDesktop: data?.horizontalFormOnDesktop ?? false,
    autoSlideDelayMs: data?.autoSlideDelayMs ?? 5000,
    variant: data?.variant ?? "default",
    ctaPosition: "side"
  };
};
