import type { TId, TTimestamps, TDocumentId } from "./strapi/modules";
import type { StrapiLeadForm, StrapiTypography } from "./strapi/strapi";
import type { TMenuVariant } from "@sitio-publico/shared-ui";
import type { StrapiPlanTab } from "@interfaces/components/planTab";
import type { TStrapiTwoColumnsRaw, TStrapiStepCoverage, TStepData } from "./flow";
export type { TStrapiTwoColumnsRaw, TStrapiStepCoverage, TStepData };

export type TStrapiStepPlans = TId & {
  __component: "step.plans";
  title?: string;
  subtitle?: string;
  plan_tab?: StrapiPlanTab;
};

export type TStrapiStepFinalData = TId & {
  __component: "step.final-data";
  content: TStrapiTwoColumnsRaw | null;
};

export type TStrapiCoverageError = TId & {
  __component: "error.semiautomatic-error";
  errorMessage?: string;
  title?: StrapiTypography | null;
  subtitle?: StrapiTypography | null;
  lead_form?: StrapiLeadForm | null;
};

export type TStrapiStepSection =
  | TStrapiStepCoverage
  | TStrapiStepPlans
  | TStrapiStepFinalData;

export type TStrapiFlowSection = TStrapiStepSection | TStrapiCoverageError;
export type TStrapiSemiautomaticSection = TStrapiFlowSection;

export type TStrapiSemiautomaticFlow = TId &
  TTimestamps & {
    documentId: TDocumentId;
    coverageOkMessage?: string | null;
    navbarVariant?: TMenuVariant | null;
    footerVariant?: TMenuVariant | null;
    section: TStrapiFlowSection[];
  };

export type TFlowStepType =
  | "step.data"
  | "step.coverage"
  | "step.plans"
  | "step.final-data";

export type TSemiautomaticStepType = TFlowStepType;
