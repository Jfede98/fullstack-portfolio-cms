import type { IIconProps } from "@sitio-publico/shared-ui";
import type { StrapiFeature } from "@interfaces/lib/strapi/strapi";

export type IFeature = Omit<StrapiFeature, "href" | "icon"> & {
  url?: StrapiFeature["href"];
  icon?: IIconProps;
};
