import type { IDualButtonsProps } from "@sitio-publico/shared-ui";
import type { 
  StrapiButton, 
  StrapiMedia, 
  StrapiTypography 
} from "@interfaces/lib/strapi/strapi";
import { mapButton } from "./button";
import { mapTypography, mapUrlMedia } from "./utils";

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

export const mapDualButtons = (data: StrapiDualButtons): IDualButtons => ({
  ...data,
  title: data.title ? mapTypography(data.title) : undefined,
  primaryButton: data.primaryButton ? mapButton(data.primaryButton) : undefined,
  secondaryButton: data.secondaryButton ? mapButton(data.secondaryButton) : undefined,
  backgroundImage: mapUrlMedia(data.backgroundImage ?? null) ?? ""
});