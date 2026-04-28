import type { ICoverageFormProps } from "@interfaces/coverageForm";

export type TLeadDistributionMode = "email" | "tom" | "both";

export interface ILeadRoutingConfig {
  id?: number;
  documentId?: string;
  name?: string;
  isActive: boolean;
  distributionMode?: TLeadDistributionMode;
  leadForm?: {
    documentId?: string;
    name?: string;
    isActive?: boolean;
  };
}

export interface ILeadFormConfig {
  id?: number;
  documentId?: string;
  name?: string;
  channel?: string;
  variant?: "default" | "DSA";
  isActive: boolean;
  automaticFlow?: boolean;
  form?: ICoverageFormProps;
  routingConfigs: ILeadRoutingConfig[];
}
