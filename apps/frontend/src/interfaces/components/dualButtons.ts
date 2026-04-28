import type { IDualButtonsProps } from "@sitio-publico/shared-ui";
import type { 
  StrapiButton, 
  StrapiMedia, 
  StrapiTypography 
} from "@interfaces/lib/strapi/strapi";

export type IDualButtons = IDualButtonsProps;

export type StrapiDualButtons = Omit<
  IDualButtons,
  | "title"
  | "primaryButton" 
  | "secondaryButton"
  | "backgroundImage"
> & {
  title?: StrapiTypography;
  primaryButton?: StrapiButton;
  secondaryButton?: StrapiButton;
  backgroundImage?: StrapiMedia;
};