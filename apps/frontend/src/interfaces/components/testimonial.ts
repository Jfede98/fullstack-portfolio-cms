import type { IButtonProps } from "@sitio-publico/shared-ui";
import type { StrapiButton, StrapiTypography, StrapiFeature } from "@interfaces/lib/strapi/strapi";
import type { TypographyData } from "./typography";

export interface ITestimonialItem {
  id?: number;
  author?: string;
  text?: string;
  rating?: number;
}

export interface ITestimonialSection {
  title?: TypographyData;
  description?: string;
  ctaButton?: IButtonProps;
  testimonials?: ITestimonialItem[];
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export type StrapiTestimonial = Omit<ITestimonialItem, "text" | "rating"> & {
  review?: string;
  rating?: string | number;
};

export type StrapiTestimonialSection = Omit<
  ITestimonialSection,
  "title" | "ctaButton" | "testimonials" | "features"
> & {
  title?: StrapiTypography;
  ctaButton?: StrapiButton;
  testimonials?: StrapiTestimonial[];
  features?: StrapiFeature[];
};
