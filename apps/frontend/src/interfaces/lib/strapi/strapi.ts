import type { ITypographyProps } from "@sitio-publico/shared-ui";
import { TId, TMediaImage } from "./modules";

type StrapiButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "noBorder"
  | "whatsapp";

type StrapiButtonType = "button" | "link" | "submit";
type StrapiButtonIdentifier =
  | "modal"
  | "whatsapp"
  | "simple"
  | "semiautomatic-flow"
  | "lead"
  | "coverage";
export type StrapiLeadDistributionMode = "email" | "tom" | "both";
type StrapiIconSize = "sm" | "md" | "lg" | "xl" | "xxl";
type StrapiIconType = "rounded" | "filled" | "outlined";
type StrapiInputType =
  | "email"
  | "number"
  | "text"
  | "tel"
  | "combobox"
  | "idCard"
  | "fingerprintCode";
export type FormSection = "banner_header" | "menu";

export type StrapiLink = {
  label: string;
  href: string;
};

export type StrapiComponentIcon = TId & {
  name: string;
  type: StrapiIconType;
  size: StrapiIconSize;
};

export type StrapiComponentLink = TId &
  StrapiLink & {
    isExternal: boolean;
    icon: StrapiComponentIcon;
  };

export type StrapiComponentCTAButton = TId &
  StrapiLink & {
    type: StrapiButtonType;
    variant: StrapiButtonVariant;
    hasIcon: boolean;
  };

export type StrapiIcon = {
  id?: number;
  name?: string;
  type?: StrapiIconType;
  size?: StrapiIconSize;
};

export type StrapiButton = {
  label?: string;
  href?: string;
  type?: StrapiButtonType;
  variant?: StrapiButtonVariant;
  hasIcon?: boolean;
  icon?: StrapiIcon;
  isExternalHref?: boolean;
  identifier: StrapiButtonIdentifier;
  lead_form?: {
    documentId?: string;
    name?: string;
    channel?: string;
    variant?: "default" | "DSA";
    isActive?: boolean;
    automaticFlow?: boolean;
    form?: StrapiForm;
    lead_routing_configs?: {
      documentId?: string;
      distributionMode?: StrapiLeadDistributionMode;
      isActive?: boolean;
    }[];
  };
};

export type StrapiFeature = {
  name?: string;
  description?: string;
  href?: string;
  icon?: StrapiIcon | StrapiIcon[];
  button?: StrapiButton;
};


export type StrapiFeatureClick = {
  id?: number;
  description?: string;
  button?: StrapiButton;
};

export type StrapiMedia = {
  url?: string;
  alternativeText?: string;
};

export type StrapiCustomIcon = {
  isActive?: boolean;
  image?: StrapiMedia;
};

export type StrapiInputOption = {
  id?: number;
  label: string;
  value: string;
  disabled?: boolean;
};

export type StrapiInput = {
  label?: string;
  placeholder?: string;
  name?: string;
  type?: StrapiInputType;
  maxLength?: number;
  icon?: StrapiIcon;
  searchable?: boolean;
  optionsSource?: "static" | "api";
  optionsApi?: "cities" | "addresses";
  options?: StrapiInputOption[];
  required?: boolean;
  column?: "default" | "left" | "right" | "full";
};

export type StrapiTypography = TId & {
  tag?: ITypographyProps["tag"];
  text?: string;
};

export type StrapiPrivacyCheckbox = {
  id?: number;
  label?: string;
  name?: string;
  required?: boolean;
};

export type StrapiStatusMessage = {
  id?: number;
  title?: string;
  description?: string;
  buttonLabel?: string;
  type?: "success" | "error" | "duplicated";
};

export type StrapiForm = {
  id?: number;
  title?: string;
  description?: string;
  icon?: StrapiIcon;
  inputs?: StrapiInput[];
  button?: StrapiButton;
  privacyCheckbox?: StrapiPrivacyCheckbox;
  statusMessage?: StrapiStatusMessage[];
  showBorderLine?: boolean;
  section?: FormSection;
};

export interface StrapiMainItem {
  id?: number;
  name?: string;
  title?: string;
  description?: string;
  text?: string;
  href?: string;
  isExternal?: boolean;
  icon?: StrapiIcon;
  button?: StrapiButton;
  color?: string;
}

export interface StrapiShortcutItem {
  id?: number;
  label?: string;
  href?: string;
  isExternal?: boolean;
  icon?: StrapiIcon;
}

export interface StrapiShortcuts {
  id?: number;
  items?: StrapiShortcutItem[];
}

export interface StrapiBlockWithItems {
  id?: number;
  title?: StrapiTypography;
  layoutVariant?: "horizontal" | "vertical";
  mainItems?: (StrapiMainItem | StrapiFeatureClick)[];
  attentionCard?: StrapiMainItem[];
  shortcuts?: StrapiShortcuts;
}

export type StrapiComparativeActiveStatus = {
  id?: number;
  isActive?: boolean;
};

export type StrapiComparativeParameter = {
  id?: number;
  label?: string;
  description?: string;
};

export type StrapiComparativeSection = {
  id?: number;
  label?: string;
  price?: string;
  prevPrice?: string;
  buttons?: StrapiButton[];
  activeStatus?: StrapiComparativeActiveStatus[];
};

export type StrapiComparativeTable = {
  id?: number;
  title?: StrapiTypography;
  subtitle?: StrapiTypography;
  titleTable?: StrapiTypography;
  comparative?: StrapiComparativeParameter[];
  sections?: StrapiComparativeSection[];
};

export interface StrapiStreamingPlan {
  id?: number;
  title?: string;
  description?: string;
  badgeText?: string | null;
  image?: TMediaImage;
  ctas?: StrapiButton[];
}

export interface StrapiStreamingPlansBlock {
  id?: number;
  title?: StrapiTypography;
  subtitle?: StrapiTypography;
  plans: StrapiStreamingPlan[];
}

export type StrapiLeadRoutingConfig = {
  id?: number;
  documentId?: string;
  name?: string;
  isActive?: boolean;
  distributionMode?: StrapiLeadDistributionMode;
  lead_form?: {
    documentId?: string;
    name?: string;
    isActive?: boolean;
  };
};

export type StrapiLeadForm = {
  id?: number;
  documentId?: string;
  name?: string;
  channel?: string;
  variant?: "default" | "DSA";
  isActive?: boolean;
  automaticFlow?: boolean;
  form?: StrapiForm;
  lead_routing_configs?: StrapiLeadRoutingConfig[];
};
