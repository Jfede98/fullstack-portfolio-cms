import type {
  IStreamingPlansProps,
  IStreamingPlan
} from "@interfaces/components/streamingPlans";
import type { IStreamingPlanCta } from "@sitio-publico/shared-ui";
import type {
  StrapiStreamingPlan,
  StrapiStreamingPlansBlock,
  StrapiButton
} from "@interfaces/lib/strapi/strapi";
import { mapTypography, mapUrlMedia } from "./utils";
import { mapButton } from "./button";

const mapButtonIdentifier = (identifier?: string): number => {
  const identifierMap: Record<string, number> = {
    modal: 0,
    whatsapp: 1,
    simple: 2,
    "semiautomatic-flow": 3,
    lead: 4
  };

  return identifier ? (identifierMap[identifier] ?? 2) : 2;
};

const mapCta = (cta: StrapiButton): IStreamingPlanCta => {
  const button = mapButton(cta);
  if (!button) return { label: "", identifier: mapButtonIdentifier(cta.identifier) };

  const { children, ...rest } = button;
  return {
    label: children as string,
    ...rest,
    identifier: mapButtonIdentifier(cta.identifier)
  };
};

const mapPlan = (plan: StrapiStreamingPlan): IStreamingPlan => {
  return {
    title: plan.title ?? "",
    description: plan.description ?? "",
    badgeText: plan.badgeText ?? undefined,
    image: {
      src: plan.image?.url ? mapUrlMedia(plan.image) ?? "" : "",
      alt: plan.image?.alternativeText ?? plan.title ?? ""
    },
    ctas: (plan.ctas ?? []).map(mapCta)
  };
};

export const mapStreamingPlans = (
  data: StrapiStreamingPlansBlock
): IStreamingPlansProps => {
  const plans = (data?.plans ?? []).map(mapPlan);

  return {
    title: data?.title ? mapTypography(data.title) : undefined,
    subtitle: data?.subtitle ? mapTypography(data.subtitle) : undefined,
    plans
  };
};
