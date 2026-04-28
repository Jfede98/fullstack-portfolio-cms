import type { TId, TTimestamps, TDocumentId } from "./strapi/modules";
import type { StrapiLeadForm } from "./strapi/strapi";
import type { TMenuVariant } from "@sitio-publico/shared-ui";
import type { StrapiPlanTab } from "@interfaces/components/planTab";
import type { TStrapiStepCoverage, TStepData } from "./flow";

export type { TStrapiStepCoverage, TStepData };


export type TStrapiStepInitialData = TId & {
  __component: "step.initial-data";
  lead_form?: StrapiLeadForm | null;
  planTab?: StrapiPlanTab | null;
  modalText?: string;
  infoText?: string;
};

/** Paso de contrato (sin campos extra por ahora). */
export type TStrapiStepContract = TId & {
  __component: "step.contract";
};

/** Paso de validación (sin campos extra por ahora). */
export type TStrapiStepValidation = TId & {
  __component: "step.validation";
};


export type TAutomaticFlowStepType =
  | "step.initial-data"
  | "step.coverage"
  | "step.contract"
  | "step.validation";

export type TStrapiAutomaticStepSection =
  | TStrapiStepCoverage
  | TStrapiStepInitialData
  | TStrapiStepContract
  | TStrapiStepValidation;

export type TStrapiAutomaticFlowSection = TStrapiAutomaticStepSection;


export type TStrapiAutomaticFlow = TId &
  TTimestamps & {
    documentId: TDocumentId;
    navbarVariant?: TMenuVariant | null;
    footerVariant?: TMenuVariant | null;
    section: TStrapiAutomaticFlowSection[];
  };


export const AUTOMATIC_STEP_LABELS: Record<TAutomaticFlowStepType, string> = {
  "step.initial-data": "Datos",
  "step.coverage": "Cobertura",
  "step.contract": "Contrato",
  "step.validation": "Validación",
};

