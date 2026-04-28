import { TMediaImage } from "@interfaces/lib/strapi/modules";
import type {
  StrapiComponentIcon,
  StrapiMedia,
  StrapiTypography
} from "@interfaces/lib/strapi/strapi";
import { URL_STATIC_RESOURCES } from "@lib/constants/constants";
import type { IIconProps, ITypographyProps } from "@sitio-publico/shared-ui";

export const mapIcon = (icon?: StrapiComponentIcon): IIconProps => ({
  name: icon?.name ?? "",
  size: icon?.size ?? "msm",
  type: icon?.type ?? "outlined",
});

export const mapUrlMedia = (data: TMediaImage | StrapiMedia | null) => {
  if (!data) return undefined;
  const url = data?.url ?? "";
  if (/^https?:\/\//i.test(url)) return url;
  
  // Para desarrollo local, usar /uploads directamente
  if (url.startsWith("/uploads/")) {
    return `${URL_STATIC_RESOURCES}${url}`;
  }
  
  // Si la URL no empieza con /uploads, asumir que es /assets-admin-xtrim y convertir
  const cleanUrl = url.replace("/assets-admin-xtrim/", "/uploads/");
  return `${URL_STATIC_RESOURCES}${cleanUrl}`;
};

export type MappedTypography = {
  text: string;
  tag?: ITypographyProps["tag"];
};

export const mapTypography = (
  typography?: StrapiTypography
): MappedTypography => ({
  text: typography?.text ?? "",
  tag: typography?.tag
});
