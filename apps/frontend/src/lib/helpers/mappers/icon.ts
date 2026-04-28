import type { IIconProps } from "@sitio-publico/shared-ui";
import type { StrapiIcon } from "@interfaces/lib/strapi/strapi";

export const mapIcon = (data?: StrapiIcon | null): IIconProps | null => {
  if (!data?.name) return null;
  return {
    name: data.name,
    type: data.type ?? undefined,
    size: data.size ?? undefined
  };
};
