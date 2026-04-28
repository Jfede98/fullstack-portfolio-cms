import type { TScreens } from "@sitio-publico/shared-ui";
import type {
  IIconProps,
  ICTAButtons,
  IFeature,
  IPlanCardProps,
  IPriceInfo,
  TDesktopPlanCardPresentation,
  TMobilePlanCardPresentation
} from "@sitio-publico/shared-ui";
import type {
  StrapiButton,
  StrapiCustomIcon,
  StrapiFeature,
  StrapiIcon,
  StrapiTypography
} from "@interfaces/lib/strapi/strapi";
import type { TypographyData } from "./typography";
import type { ILeadFormSelection } from "@interfaces/coverageForm";

export type IPlanPriceInfo = IPriceInfo;
export type IPlanCtaButton = ICTAButtons & {
  leadFormSelection?: ILeadFormSelection;
};
export type IPlanFeature = IFeature;
export type IPlanCardData = Omit<IPlanCardProps, "ctaButtons"> & {
  ctaButtons: IPlanCtaButton[];
};

export interface IPlanGridRule {
  id?: number;
  breakpoint?: TScreens;
  itemsPerRow?: number;
}

export interface IPlanCategory {
  id?: number;
  label?: string;
  icon?: IIconProps;
  title?: TypographyData;
  description?: string;
  plans?: IPlanCardData[];
}

export interface IPlanTab {
  title?: TypographyData;
  description?: string;
  categories?: IPlanCategory[];
  gridRules?: IPlanGridRule[];
  desktopPresentation?: TDesktopPlanCardPresentation;
  mobilePresentation?: TMobilePlanCardPresentation;
  showCategoryHeader?: boolean;
  className?: { section?: string };
}

export type StrapiPriceInfo = Partial<IPriceInfo>;

export type StrapiPlan = Partial<
  Omit<IPlanCardData, "priceInfo" | "ctaButtons" | "benefits" | "apps" | "detailsContent">
> & {
  identifier?: string;
  isRecommendedText?: string;
  priceInfo?: StrapiPriceInfo;
  ctaButtons?: StrapiButton[];
  benefits?: StrapiFeature[];
  apps?: StrapiApp[];
  detailsContent?: string;
};

export type StrapiApp = IPlanFeature & {
  custom_icon?: StrapiCustomIcon | null;
};

export type StrapiCategoryTab = Omit<IPlanCategory, "icon" | "plans"> & {
  icon?: StrapiIcon;
  title?: StrapiTypography;
  plans?: StrapiPlan[];
};

export type StrapiPlanGridRule = Partial<IPlanGridRule>;

export type StrapiPlanTab = Omit<IPlanTab, "title" | "categories"> & {
  title?: StrapiTypography;
  categories?: StrapiCategoryTab[];
  gridRules?: StrapiPlanGridRule[];
};
