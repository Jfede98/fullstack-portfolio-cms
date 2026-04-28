import type {
  Feature,
  ICTABenefitsProps
} from "@sitio-publico/shared-ui";
import type { ILeadFormSelection } from "@interfaces/coverageForm";
import type {
  StrapiButton,
  StrapiFeature,
  StrapiMedia,
  StrapiTypography
} from "@interfaces/lib/strapi/strapi";

export type ICTABanner = Omit<Partial<ICTABenefitsProps>, "button"> & {
  features?: Feature[];
  button?: ICTABenefitsProps["button"] & {
    leadFormSelection?: ILeadFormSelection;
  };
};

export type StrapiCtaBanner = Omit<
  ICTABanner,
  | "title"
  | "subtitle"
  | "button"
  | "backgroundImage"
  | "features"
  | "icon"
  | "className"
> & {
  title?: StrapiTypography;
  description?: string;
  cta?: StrapiButton;
  backgroundImage?: StrapiMedia;
  features?: StrapiFeature[];
  layout?: "vertical" | "horizontal";
  horizontalAlignment?: "left" | "right";
};
