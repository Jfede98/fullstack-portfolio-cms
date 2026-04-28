import type { StrapiButton, StrapiTypography } from "@interfaces/lib/strapi/strapi";
import type { TMediaImage } from "@interfaces/lib/strapi/modules";
import type { IButtonProps, ITextConfig } from "@sitio-publico/shared-ui";
import type { ILeadFormSelection } from "@interfaces/coverageForm";

export interface IInformationalSection {
  title: ITextConfig;
  subtitle?: ITextConfig;
  description: string;
  cta?: IButtonProps & {
    leadFormSelection?: ILeadFormSelection;
  };
  image: {
    src: string;
    alt?: string;
  };
}

export type StrapiInformationalSection = Omit<
  IInformationalSection,
  "title" | "subtitle" | "cta" | "image"
> & {
  title: StrapiTypography;
  subtitle?: StrapiTypography;
  button: StrapiButton;
  image: TMediaImage;
};

