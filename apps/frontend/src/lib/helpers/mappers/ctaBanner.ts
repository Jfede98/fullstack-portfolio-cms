import type { ICTABanner, StrapiCtaBanner } from "@interfaces/components/ctaBanner";
import { mapTypography, mapUrlMedia } from "./utils";
import { mapButton } from "./button";

export const mapCtaBanner = (data: StrapiCtaBanner): ICTABanner => {
  const features = data?.features
    ?.map((feature) => {
      const iconName = Array.isArray(feature?.icon)
        ? (feature?.icon?.[0]?.name ?? undefined)
        : (feature?.icon?.name ?? undefined);

      if (!iconName) return undefined;

      return {
        iconName,
        text: feature?.description ?? feature?.name ?? ""
      };
    })
    .filter(Boolean) as ICTABanner["features"];

  return {
    title: data?.title ? mapTypography(data.title) : { text: "" },
    subtitle: data?.description ?? "",
    button: mapButton(data?.cta),
    backgroundImage:
      (mapUrlMedia(data?.backgroundImage ?? null) ?? "").replace(
        "/uploads/",
        "/assets-admin-xtrim/"
      ),
    features: features ?? [],
    layout: data?.layout ?? "vertical",
    horizontalAlignment: data?.horizontalAlignment ?? "left"
  };
};
