import type { IIconProps } from "@shared-ui/interfaces/icons";

export type TDesktopPlanCardPresentation = "default" | "trimmed" | "pricing" | "mobile";
export type TMobilePlanCardPresentation = "default" | "accordion";

export interface IPlanCardClassName {
  wrapper?: string;
  topContainer?: string;
  midContainer?: string;
  speedContainer?: string;
  speedText?: string;
  planNameText?: string;
  badge?: string;
  badgeText?: string;
  amountContainer?: string;
  amountText?: string;
  amountImp?: string;
  originalPrice?: string;
  legalDisclaimer?: string;
  btnContainer?: string;
  topBadge?: string;
  benefitsContainer?: string;
  benefitItem?: string;
  benefitIconWrapper?: string;
  benefitText?: string;
  appsLabel?: string;
  appsContainer?: string;
  appItem?: string;
  appImage?: string;
  appName?: string;
  appDescription?: string;
  dropdownContent?: string;
  dropdownContentMobile?: string;
  dropdownDetails?: string;
  divider?: string;
  mobileAccordionCard?: string;
}

export interface IBenefitsAndAppsProps {
  benefits: IFeature[];
  apps: IFeature[];
  className?: IPlanCardClassName;
}

export interface IPlanCardProps {
  id?: string;
  name: string;
  speedValue?: string;
  speedUnit?: string;
  isRecommended?: boolean;
  isRecommendedText?: string;
  priceInfo: IPriceInfo;
  ctaButtons: ICTAButtons[];
  benefits: IFeature[];
  apps: IFeature[];
  detailsContent?: string;
  className?: IPlanCardClassName;
  triggerOnClick?: () => void;
  triggerOnActive?: (active: boolean) => void;
  desktopPresentation?: TDesktopPlanCardPresentation;
  mobilePresentation?: TMobilePlanCardPresentation;
  mobileAccordionActive?: boolean;
}

export interface ICTAButtons {
  label: string;
  href?: string;
  type?: "primary" | "secondary" | "tertiary" | "outline" | "noBorder";
  icon?: string;
  identifier?: number;
  target?: "_blank" | "_self";
  onClick?: () => void;
}

export interface IFeature {
  name?: string;
  description?: string;
  url?: string;
  imageAlt?: string;
  useCustomIcon?: boolean;
  customIcon?: string;
  icon?: string | IIconProps;
}

export interface IPriceInfo {
  amount: string;
  taxLabel: string;
  originalPrice: string;
  legalDisclaimer: string;
  promoLabel: string;
}
