import type { TMediaImage } from "@interfaces/lib/strapi/modules";
import type {
  StrapiButton,
  StrapiTypography
} from "@interfaces/lib/strapi/strapi";
import type { MappedTypography } from "./utils";
import { mapTypography, mapUrlMedia } from "./utils";
import { mapButton } from "./button";

export interface StrapiBannerConfig {
  title?: StrapiTypography;
  subtitle?: StrapiTypography;
  img?: TMediaImage;
  enabledOverlay?: boolean;
  useManualLink?: boolean;
  cta?: StrapiButton;
  link?: string;
  isExternal?: boolean;
}

export interface StrapiSharedBanner {
  bannerDesktop?: StrapiBannerConfig;
  bannerMobile?: StrapiBannerConfig;
  ctaPosition?: "side" | "below";
}

export interface MappedBannerConfig {
  title: MappedTypography;
  subtitle: MappedTypography;
  image?: string;
  enableOverlay: boolean;
  useManualLink: boolean;
  ctaButton?: ReturnType<typeof mapButton>;
  link?: string;
  isExternal: boolean;
}

export interface MappedSharedBanner {
  desktop: MappedBannerConfig;
  mobile: MappedBannerConfig;
  ctaPosition: "side" | "below";
}

const mapBannerConfig = (data?: StrapiBannerConfig): MappedBannerConfig => {
  const useManualLink = data?.useManualLink ?? false;

  return {
    title: mapTypography(data?.title),
    subtitle: mapTypography(data?.subtitle),
    image: mapUrlMedia(data?.img ?? null),
    enableOverlay: data?.enabledOverlay ?? true,
    useManualLink,
    ctaButton: useManualLink ? undefined : mapButton(data?.cta),
    link: useManualLink ? data?.link : undefined,
    isExternal: useManualLink ? (data?.isExternal ?? false) : false
  };
};

export const mapSharedBanner = (
  data?: StrapiSharedBanner
): MappedSharedBanner => ({
  desktop: mapBannerConfig(data?.bannerDesktop),
  mobile: mapBannerConfig(data?.bannerMobile),
  ctaPosition: data?.ctaPosition ?? "below"
});
