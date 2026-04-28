"use server";

import type {
  ILeadFormConfig,
  ILeadRoutingConfig
} from "@interfaces/components/leadDistribution";
import type { ILeadFormSelection } from "@interfaces/coverageForm";
import type {
  StrapiLeadForm,
  StrapiForm,
  StrapiLeadDistributionMode,
  StrapiLeadRoutingConfig
} from "@interfaces/lib/strapi/strapi";
import { fetchAdminToken } from "@lib/fetch";
import { fetchingWrapperError } from "../utils";
import { mapLeadForm } from "@lib/helpers/mappers/leadForm";
import { mapLeadRoutingConfig } from "@lib/helpers/mappers/leadRoutingConfig";
import { mapperForm } from "@lib/helpers/mappers/form";

type TCollectionResponse<T> = {
  data?: T[];
};

type TLeadFormFullResponse = {
  leadFormDocumentId?: string;
  leadFormName?: string;
  channel?: string;
  variant?: "default" | "DSA";
  automaticFlow?: boolean;
  form?: StrapiForm;
  routingConfigDocumentId?: string;
  distributionMode?: StrapiLeadDistributionMode;
};

const LEAD_FORMS_COLLECTION = "lead-forms";
const LEAD_ROUTING_COLLECTION = "lead-routing-configs";

export const getLeadFormSelectionByDocumentId = async (
  leadFormDocumentId: string
): Promise<ILeadFormSelection | undefined> =>
  fetchingWrapperError<ILeadFormSelection | undefined>({
    errorMessage: `getLeadFormSelectionByDocumentId [${leadFormDocumentId}]`,
    callback: async () => {
      if (!leadFormDocumentId) return undefined;

      const response = await fetchAdminToken<TLeadFormFullResponse>(
        `api/lead-forms/${encodeURIComponent(leadFormDocumentId)}/full`,
        { cache: "no-store" }
      );

      if (!response?.leadFormDocumentId || !response?.form) return undefined;

      return {
        leadFormDocumentId: response.leadFormDocumentId,
        leadFormName: response.leadFormName,
        channel: response.channel,
        variant: response.variant ?? "default",
        automaticFlow: response.automaticFlow ?? false,
        form: {
          ...mapperForm(response.form),
          variant: response.variant === "DSA" ? "dsa" : "default"
        },
        routingConfigDocumentId: response.routingConfigDocumentId,
        distributionMode: response.distributionMode,
      };
    },
  });

export const getLeadForms = async (
  pLevel = 3
): Promise<ILeadFormConfig[] | undefined> =>
  fetchingWrapperError<ILeadFormConfig[]>({
    errorMessage: "getLeadForms",
    callback: async () => {
      const response = await fetchAdminToken<TCollectionResponse<StrapiLeadForm>>(
        `api/${LEAD_FORMS_COLLECTION}?filters[isActive][$eq]=true&pLevel=${pLevel}`
      );

      return (response?.data ?? [])
        .map(mapLeadForm)
        .filter(Boolean) as ILeadFormConfig[];
    }
  });

export const getLeadRoutingConfigs = async (
  pLevel = 2
): Promise<ILeadRoutingConfig[] | undefined> =>
  fetchingWrapperError<ILeadRoutingConfig[]>({
    errorMessage: "getLeadRoutingConfigs",
    callback: async () => {
      const response = await fetchAdminToken<
        TCollectionResponse<StrapiLeadRoutingConfig>
      >(`api/${LEAD_ROUTING_COLLECTION}?filters[isActive][$eq]=true&pLevel=${pLevel}`);

      return (response?.data ?? [])
        .map(mapLeadRoutingConfig)
        .filter(Boolean) as ILeadRoutingConfig[];
    }
  });

export const getLeadRoutingConfigsByLeadForm = async (
  leadFormDocumentId: string,
  pLevel = 2
): Promise<ILeadRoutingConfig[] | undefined> =>
  fetchingWrapperError<ILeadRoutingConfig[]>({
    errorMessage: `getLeadRoutingConfigsByLeadForm [${leadFormDocumentId}]`,
    callback: async () => {
      if (!leadFormDocumentId) return [];

      const response = await fetchAdminToken<
        TCollectionResponse<StrapiLeadRoutingConfig>
      >(
        `api/${LEAD_ROUTING_COLLECTION}?filters[isActive][$eq]=true&filters[lead_form][documentId][$eq]=${leadFormDocumentId}&pLevel=${pLevel}`
      );

      return (response?.data ?? [])
        .map(mapLeadRoutingConfig)
        .filter(Boolean) as ILeadRoutingConfig[];
    }
  });
