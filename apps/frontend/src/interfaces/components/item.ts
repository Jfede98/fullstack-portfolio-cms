import type { IIconProps } from "@sitio-publico/shared-ui";
import type { StrapiComponentLink } from "@interfaces/lib/strapi/strapi";

export type IItem = Omit<StrapiComponentLink, "icon"> & {
  icon?: IIconProps;
};
