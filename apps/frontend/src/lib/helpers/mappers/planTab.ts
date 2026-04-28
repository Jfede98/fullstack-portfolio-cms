import type {
  IPlanCardData,
  IPlanCategory,
  IPlanFeature,
  IPlanGridRule,
  IPlanTab,
  StrapiApp,
  StrapiCategoryTab,
  StrapiPlan,
  StrapiPlanGridRule,
  StrapiPlanTab
} from "@interfaces/components/planTab";
import type { StrapiFeature } from "@interfaces/lib/strapi/strapi";
import type {
  IIconProps,
  TDesktopPlanCardPresentation,
  TMobilePlanCardPresentation
} from "@sitio-publico/shared-ui";
import { mapIcon } from "./icon";
import { mapTypography } from "./utils";
import { mapButton } from "./button";

const getCategoryLabel = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  if ("label" in value && typeof value.label === "string") return value.label;
  if ("text" in value && typeof value.text === "string") return value.text;
  if ("title" in value && typeof value.title === "string") return value.title;
  return "";
};

const getFeatureIconName = (
  icon?: StrapiFeature["icon"]
): string | undefined => {
  if (!icon) return undefined;
  if (Array.isArray(icon)) return icon[0]?.name ?? undefined;
  return icon.name ?? undefined;
};

const mapButtonIdentifier = (identifier?: string): number => {
  const identifierMap: Record<string, number> = {
    modal: 0,
    whatsapp: 1,
    simple: 2,
    "semiautomatic-flow": 3,
    lead: 4
  };

  return identifier ? (identifierMap[identifier] ?? 0) : 0;
};

const normalizePlanButtonType = (
  value?: string
): IPlanCardData["ctaButtons"][number]["type"] => {
  if (
    value === "primary" ||
    value === "secondary" ||
    value === "tertiary" ||
    value === "outline" ||
    value === "noBorder"
  ) {
    return value;
  }

  return undefined;
};

const mapFeature = (feature?: StrapiFeature | null): IPlanFeature | null => {
  if (!feature) return null;

  const iconName = getFeatureIconName(feature.icon);
  const name = feature.name ?? undefined;
  const description = feature.description ?? undefined;
  const url = feature.href ?? undefined;

  if (!name && !description && !url && !iconName) return null;

  return {
    name,
    description,
    url,
    icon: iconName
  };
};

const mapApp = (app?: StrapiApp | null): IPlanFeature | null => {
  if (!app) return null;

  const customIcon = app.custom_icon;
  // Business rule: inactive custom icons from CMS must not be rendered.
  const hasInactiveCustomIcon = customIcon?.isActive === false;
  const hasActiveCustomIcon = !hasInactiveCustomIcon;
  const customIconUrl = hasActiveCustomIcon ? customIcon?.image?.url : undefined;
  const customIconAlt = hasActiveCustomIcon
    ? customIcon?.image?.alternativeText
    : undefined;
  const useCustomIcon = hasInactiveCustomIcon
    ? false
    : (app.useCustomIcon ?? Boolean(customIconUrl));

  return {
    name: app.name ?? undefined,
    description: app.description ?? undefined,
    url: customIconUrl ?? app.url ?? undefined,
    imageAlt: customIconAlt ?? app.imageAlt ?? undefined,
    useCustomIcon,
    customIcon: app.customIcon ?? undefined,
    icon: app.icon
  };
};

export const mapPlan = (
  plan?: StrapiPlan | null,
  desktopPresentation?: TDesktopPlanCardPresentation,
  mobilePresentation?: TMobilePlanCardPresentation
): IPlanCardData | null => {
  if (!plan?.name) return null;

  const benefits = (plan.benefits?.map(mapFeature).filter(Boolean) ??
    []) as IPlanFeature[];
  const apps = (plan.apps?.map(mapApp).filter(Boolean) ?? []) as IPlanFeature[];

  return {
    id: plan.identifier,
    name: plan.name,
    speedValue: plan.speedValue ?? undefined,
    speedUnit: plan.speedUnit ?? undefined,
    isRecommended: Boolean(plan.isRecommended),
    isRecommendedText: plan.isRecommendedText ?? undefined,
    priceInfo: {
      amount: plan.priceInfo?.amount ?? "",
      taxLabel: plan.priceInfo?.taxLabel ?? "",
      originalPrice: plan.priceInfo?.originalPrice ?? "",
      legalDisclaimer: plan.priceInfo?.legalDisclaimer ?? "",
      promoLabel: plan.priceInfo?.promoLabel ?? ""
    },
    ctaButtons:
      plan.ctaButtons?.map((button) => {
        const mappedButton = mapButton(button);

        return {
          label: mappedButton?.children?.toString() ?? button?.label ?? "",
          href: mappedButton?.href ?? button?.href ?? undefined,
          type: normalizePlanButtonType(
            (mappedButton?.color as string | undefined) ?? button?.variant
          ),
          icon: mappedButton?.icon ?? button?.icon?.name ?? undefined,
          identifier: mappedButton?.identifier ?? mapButtonIdentifier(button?.identifier),
          leadFormSelection: mappedButton?.leadFormSelection,
          target: button?.isExternalHref ? "_blank" : "_self"
        };
      }) ?? [],
    benefits,
    apps,
    detailsContent: plan.detailsContent ?? undefined,
    desktopPresentation,
    mobilePresentation
  } as any //TODO: den arreglando este any | nada vale :( );
};

const mapCategory = (
  category?: StrapiCategoryTab | null,
  desktopPresentation?: TDesktopPlanCardPresentation,
  mobilePresentation?: TMobilePlanCardPresentation
): IPlanCategory | null => {
  if (!category) return null;

  return {
    id: category.id ?? undefined,
    label: getCategoryLabel(category.label) || undefined,
    icon: mapIcon(category.icon ?? undefined) as IIconProps,
    title: category.title ? mapTypography(category.title) : undefined,
    description: category.description ?? undefined,
    plans: (category.plans
      ?.map((p) => mapPlan(p, desktopPresentation, mobilePresentation))
      .filter(Boolean) ?? []) as IPlanCardData[]
  };
};

const mapGridRule = (
  rule?: StrapiPlanGridRule | null
): IPlanGridRule | null => {
  if (!rule) return null;

  return {
    id: rule.id ?? undefined,
    breakpoint: rule.breakpoint ?? undefined,
    itemsPerRow: rule.itemsPerRow ?? undefined
  };
};

export const mapPlanTab = (data: StrapiPlanTab): IPlanTab => {
  const desktopPresentation = data?.desktopPresentation ?? undefined;
  const mobilePresentation = data?.mobilePresentation ?? undefined;

  return {
    title: data?.title ? mapTypography(data.title) : undefined,
    description: data?.description ?? undefined,
    categories: (data?.categories
      ?.map((c) => mapCategory(c, desktopPresentation, mobilePresentation))
      .filter(Boolean) ?? []) as IPlanCategory[],
    gridRules: (data?.gridRules?.map(mapGridRule).filter(Boolean) ??
      []) as IPlanGridRule[],
    desktopPresentation,
    mobilePresentation
  };
};
