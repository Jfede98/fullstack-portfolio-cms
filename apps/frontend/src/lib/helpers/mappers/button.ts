import type { IButtonProps } from "@sitio-publico/shared-ui";
import type { StrapiButton } from "@interfaces/lib/strapi/strapi";
import type { ILeadFormSelection } from "@interfaces/coverageForm";
import { mapperForm } from "./form";

export type TMappedButton = IButtonProps & {
  identifier?: number;
  leadFormSelection?: ILeadFormSelection;
};

export const mapButtonIdentifier = (identifier: StrapiButton["identifier"]): number => {
  const map: Record<NonNullable<StrapiButton["identifier"]>, number> = {
    modal: 0,
    whatsapp: 1,
    simple: 2,
    "semiautomatic-flow": 3,
    lead: 4,
    coverage: 5
  };

  return map[identifier] ?? 2;
};

export const mapLeadFormSelection = (
  button?: StrapiButton | null
): ILeadFormSelection | undefined => {
  if (button?.identifier !== "modal") return undefined;

  const leadForm = button.lead_form;
  if (!leadForm?.documentId) return undefined;

  const activeConfig = leadForm.lead_routing_configs?.find(
    (config) => config?.isActive !== false
  );

  return {
    leadFormDocumentId: leadForm.documentId,
    leadFormName: leadForm.name,
    channel: leadForm.channel,
    variant: leadForm.variant ?? "default",
    automaticFlow: leadForm.automaticFlow ?? false,
    form: leadForm.form
      ? {
          ...mapperForm(leadForm.form),
          variant: leadForm.variant === "DSA" ? "dsa" : "default"
        }
      : undefined,
    routingConfigDocumentId: activeConfig?.documentId,
    distributionMode: activeConfig?.distributionMode
  };
};

export const normalizeButtonColor = (
  variant?: StrapiButton["variant"]
): IButtonProps["color"] => {
  if (variant === "secondary" || variant === "tertiary" || variant === "whatsapp") return variant;
  if (variant === "outline" || variant === "noBorder") return variant;
  return "primary";
};

export const mapButton = (
  data?: StrapiButton | null
): TMappedButton | undefined => {
  if (!data?.label) return undefined;
  const hasHref = Boolean(data.href);
  const resolvedType =
    hasHref && (data.isExternalHref || !data.type || data.type === "link")
      ? "link"
      : data.type;

  return {
    children: data.label,
    href: data.href ?? undefined,
    type: resolvedType ?? undefined,
    color: normalizeButtonColor(data.variant),
    target: data.isExternalHref ? "_blank" : undefined,
    icon: data.hasIcon ? (data.icon?.name ?? undefined) : undefined,
    leadFormSelection: mapLeadFormSelection(data),
    identifier: data.identifier ? mapButtonIdentifier(data.identifier) : undefined
  };
};
