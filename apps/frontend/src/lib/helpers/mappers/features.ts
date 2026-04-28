import type { IFeaturesProps } from "@interfaces/components/features";
import type { StrapiBlockWithItems, StrapiFeatureClick, StrapiIcon } from "@interfaces/lib/strapi/strapi";
import { mapTypography } from "./utils";
import { mapButton } from "./button";

const getIconName = (icon?: StrapiIcon | null): string | undefined => {
  if (!icon) return undefined;
  return icon.name ?? undefined;
};

const getLayout = (
  layoutVariant?: StrapiBlockWithItems["layoutVariant"]
): IFeaturesProps["layout"] =>
  layoutVariant === "vertical" ? "vertical" : "horizontal";

export const mapFeatures = (data: StrapiBlockWithItems): IFeaturesProps => {
  const items = (data?.mainItems ?? []).map((item) => {
    const featureClick = item as StrapiFeatureClick;
    const button = featureClick.button;
    const mappedButton = mapButton(button);
    return {
      id: featureClick.id,
      description: featureClick.description ?? button?.label ?? "",
      title: featureClick.button?.label ?? "",
      icon: getIconName(button?.icon) ?? "",
      href: button?.href ?? undefined,
      isExternal: button?.isExternalHref ?? false,
      color: mappedButton?.color ?? undefined,
      identifier: mappedButton?.identifier,
      leadFormSelection: mappedButton?.leadFormSelection
    };
  });

  return {
    id: data?.id,
    title: data?.title ? mapTypography(data.title) : undefined,
    layout: getLayout(data?.layoutVariant),
    items
  };
};

