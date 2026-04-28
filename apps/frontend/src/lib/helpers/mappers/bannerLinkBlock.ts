import type { StrapiSharedBanner } from "./banner";
import { mapSharedBanner } from "./banner";
import type { MappedTypography } from "./utils";
import type { TMappedButton } from "./button";

type BannerLinkConfig = {
  image: string;
  enableOverlay: boolean;
  title: MappedTypography;
  subtitle: MappedTypography;
  ctaButton?: TMappedButton;
  useManualLink?: boolean;
  link?: string;
  isExternal?: boolean;
};

export interface BannerLinkData {
  desktop: BannerLinkConfig;
  mobile: BannerLinkConfig;
  link?: string;
  isExternal?: boolean;
}

export interface BannerLinkBlockProps {
  banners: BannerLinkData[];
}

export interface StrapiBannerLink {
  banner?: StrapiSharedBanner;
}

export interface StrapiBannerLinkBlock {
  banner?: StrapiSharedBanner | StrapiSharedBanner[];
  Banner?: StrapiBannerLink[];
}

export const mapBannerLinkBlock = (data: StrapiBannerLinkBlock): BannerLinkBlockProps => {
  const normalizedBanners: StrapiBannerLink[] =
    data.Banner && data.Banner.length > 0
      ? data.Banner
      : Array.isArray(data.banner)
        ? data.banner.map((banner) => ({ banner }))
        : data.banner
          ? [
              {
                banner: data.banner
              }
            ]
        : [];

  const banners = normalizedBanners.map((banner): BannerLinkData => {
    const mappedBanner = mapSharedBanner(banner.banner);

    return {
      desktop: {
        image: mappedBanner.desktop.image || "",
        enableOverlay: mappedBanner.desktop.enableOverlay,
        title: mappedBanner.desktop.title,
        subtitle: mappedBanner.desktop.subtitle,
        ctaButton: mappedBanner.desktop.ctaButton,
        useManualLink: mappedBanner.desktop.useManualLink,
        link: mappedBanner.desktop.link,
        isExternal: mappedBanner.desktop.isExternal
      },
      mobile: {
        image: mappedBanner.mobile.image || "",
        enableOverlay: mappedBanner.mobile.enableOverlay,
        title: mappedBanner.mobile.title,
        subtitle: mappedBanner.mobile.subtitle,
        ctaButton: mappedBanner.mobile.ctaButton,
        useManualLink: mappedBanner.mobile.useManualLink,
        link: mappedBanner.mobile.link,
        isExternal: mappedBanner.mobile.isExternal
      },
      link: mappedBanner.desktop.link ?? mappedBanner.mobile.link,
      isExternal:
        mappedBanner.desktop.link
          ? mappedBanner.desktop.isExternal
          : mappedBanner.mobile.link
            ? mappedBanner.mobile.isExternal
            : false
    };
  });

  return { banners };
};
