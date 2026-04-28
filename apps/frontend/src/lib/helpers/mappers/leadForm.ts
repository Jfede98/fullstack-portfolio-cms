import type { ILeadFormConfig } from "@interfaces/components/leadDistribution";
import type { StrapiLeadForm } from "@interfaces/lib/strapi/strapi";
import { mapperForm } from "./form";
import { mapLeadRoutingConfig } from "./leadRoutingConfig";

export const mapLeadForm = (
  data?: StrapiLeadForm | null
): ILeadFormConfig | undefined => {
  if (!data) return undefined;

  const routingConfigs = (data.lead_routing_configs ?? [])
    .map(mapLeadRoutingConfig)
    .filter(Boolean) as NonNullable<ILeadFormConfig["routingConfigs"]>;

  return {
    id: data.id,
    documentId: data.documentId,
    name: data.name,
    channel: data.channel,
    variant: data.variant ?? "default",
    isActive: data.isActive !== false,
    automaticFlow: data.automaticFlow ?? false,
    form: data.form
      ? {
          ...mapperForm(data.form),
          variant: data.variant === "DSA" ? "dsa" : "default"
        }
      : undefined,
    routingConfigs
  };
};
