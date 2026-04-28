import type { TypographyData } from "@interfaces/components/typography";
import type { ILeadFormSelection } from "@interfaces/coverageForm";

export interface IPlanCarouselTestimonial {
  id: number;
  rating: number;
  text: string;
  author: string;
}

export interface IPlanCarouselButton {
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "tertiary";
  identifier?: number;
  leadFormSelection?: ILeadFormSelection;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

export interface IPlanCarouselFeature {
  icon: string;
  title: string;
  description: string;
}

export interface IPlanCarouselProps {
  title: TypographyData;
  description: string;
  button?: IPlanCarouselButton;
  testimonials: IPlanCarouselTestimonial[];
  features?: IPlanCarouselFeature[];
}
