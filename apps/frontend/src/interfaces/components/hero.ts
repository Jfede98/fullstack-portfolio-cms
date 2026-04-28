import type { ComponentType, ReactNode } from "react";
import type { TId, TMediaImage, TWidget } from "@interfaces/lib/strapi/modules";
import type {
  StrapiFeature,
  StrapiFeatureClick,
  StrapiIcon,
  StrapiLeadForm
} from "@interfaces/lib/strapi/strapi";
import type { IAvatarGroupProps, IButtonProps } from "@sitio-publico/shared-ui";
import type { TypographyData } from "./typography";
import type { StrapiSharedBanner } from "@lib/helpers/mappers/banner";
import type { ILeadFormSelection } from "@interfaces/coverageForm";

export type StrapiHeroIcon = TId & StrapiIcon;
export type StrapiHeroFeature = TId &
  Omit<StrapiFeature, "icon"> & {
    icon?: StrapiHeroIcon;
  };

export type StrapiHeroFeatureClick = TId & StrapiFeatureClick;

export interface StrapiHeroSlide {
  id: number;
  navigationLabel?: string;
  banner?: StrapiSharedBanner;
  features?: StrapiHeroFeatureClick[];
  avatar?: TMediaImage;
  lead_form?: StrapiLeadForm;
}

export interface StrapiHero {
  id?: number;
  slides?: StrapiHeroSlide[];
  heroOverlaySource?: "widget" | "lead_form";
  overlayWidget?: TWidget;
  overlayLeadForm?: StrapiLeadForm;
  showWidgetOnDesktop?: boolean;
  horizontalFormOnDesktop?: boolean;
  autoSlideDelayMs?: number;
  variant?: "default" | "light";
}

export interface FeatureData {
  name: string;
  text: string;
  href?: string;
  identifier?: number;
  leadFormSelection?: ILeadFormSelection;
}

export interface BackgroundImage {
  desktop?: string;
  mobile?: string;
  enableOverlayDesktop: boolean;
  enableOverlayMobile: boolean;
}

export interface ResponsiveBannerContent {
  desktop: {
    title: TypographyData;
    subtitle: TypographyData;
    ctaButton?: IButtonProps;
    useManualLink?: boolean;
    link?: string;
    isExternal?: boolean;
  };
  mobile: {
    title: TypographyData;
    subtitle: TypographyData;
    ctaButton?: IButtonProps;
    useManualLink?: boolean;
    link?: string;
    isExternal?: boolean;
  };
}

export interface WelcomeData {
  title: TypographyData;
  subtitle: TypographyData;
  responsiveContent?: ResponsiveBannerContent;
  features: FeatureData[];
  ctaPosition?: "side" | "below";
  backgroundImage?: BackgroundImage;
  imageLoading?: "eager" | "lazy";
  imageFetchPriority?: "high" | "auto";
  widget?: ReactNode;
  ctaButton?: IButtonProps;
}

export interface HeroSlideData {
  id: number;
  navigationText?: string;
  content: WelcomeData;
}

type NavigationHero = IAvatarGroupProps["avatars"][number];

export interface HeroProps {
  id?: number;
  slides: HeroSlideData[];
  avatars?: NavigationHero[];
  labels?: string[];
  widget?: ReactNode;
  isFormWidget?: boolean;
  showWidgetOnDesktop?: boolean;
  horizontalFormOnDesktop?: boolean;
  autoSlideDelayMs?: number;
  variant?: "default" | "light";
  ctaPosition?: "side" | "below";
}

export interface SlideWrapperProps {
  children?: ComponentType<unknown>;
  data?: WelcomeData;
  id?: number;
  navigationText?: string;
}
