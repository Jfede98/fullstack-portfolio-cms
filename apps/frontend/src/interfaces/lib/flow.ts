import type { TId, TWidget } from "./strapi/modules";
import type { StrapiLeadForm } from "./strapi/strapi";


export type TStrapiTwoColumnRule = {
  chooseContent?: "widget" | "lead_form" | null;
  widget?: TWidget | null;
  lead_form?: StrapiLeadForm | null;
  width?: string | null;
};

export type TStrapiTwoColumnsRaw = {
  id?: number;
  __component?: "block.two-columns";
  leftContentType?: TStrapiTwoColumnRule | null;
  rightContentType?: TStrapiTwoColumnRule | null;
  leftWidget?: TWidget | null;
  rightWidget?: TWidget | null;
  backgroundVariant?: string | null;
  showDivider?: boolean | null;
  dividerColor?: string | null;
  leftWidth?: string | null;
  rightWidth?: string | null;
};


export type TStrapiStepCoverage = TId & {
  __component: "step.coverage";
  content: TStrapiTwoColumnsRaw | null;
};


export type TStepData = {
  id: string;
  label: string;
  ariaLabel: string;
  stepType?: string;
};

