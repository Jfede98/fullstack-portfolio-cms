import type { ILeadRoutingConfig } from "@interfaces/components/leadDistribution";
import type { StrapiLeadRoutingConfig } from "@interfaces/lib/strapi/strapi";

export const mapLeadRoutingConfig = (
  data?: StrapiLeadRoutingConfig | null
): ILeadRoutingConfig | undefined => {
  if (!data) return undefined;

  return {
    id: data.id,
    documentId: data.documentId,
    name: data.name,
    isActive: data.isActive !== false,
    distributionMode: data.distributionMode,
    leadForm: data.lead_form
      ? {
          documentId: data.lead_form.documentId,
          name: data.lead_form.name,
          isActive: data.lead_form.isActive
        }
      : undefined
  };
};

