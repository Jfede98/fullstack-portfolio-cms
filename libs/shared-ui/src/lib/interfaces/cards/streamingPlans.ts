import type { IButtonProps } from "@shared-ui/interfaces/button";
import type { ICarouselProps } from "@shared-ui/interfaces/carousel";
import type { ITextConfig } from "@shared-ui/interfaces/typography";

export type IStreamingPlanCta = Omit<IButtonProps, "children"> & {
  label: string;
  identifier?: number;
};

export type IStreamingPlanCard = {
  title: string;
  description: string;
  image: {
    src: string;
    alt?: string;
  };
  badgeText?: string;
  ctas: IStreamingPlanCta[];
  dataTestid?: string;
};

export type IStreamingPlanCardClassName = {
  card?: string;
  imageWrapper?: string;
  image?: string;
  imageOverlay?: string;
  imageGradient?: string;
  badge?: string;
  content?: string;
  cardTitle?: string;
  cardDescription?: string;
  buttons?: string;
  primaryButton?: string;
  secondaryButton?: string;
};

export interface IStreamingPlanCardProps extends IStreamingPlanCard {
  className?: IStreamingPlanCardClassName;
}

export type IStreamingPlansLayoutMode = "grid" | "carousel";

export type IStreamingPlansLayout = {
  mobile?: IStreamingPlansLayoutMode;
  desktop?: IStreamingPlansLayoutMode;
};

export type IStreamingPlansCarouselProps = Omit<
  ICarouselProps<IStreamingPlanCard>,
  "Element" | "data"
>;

export type IStreamingPlansCarouselConfig = {
  mobile?: IStreamingPlansCarouselProps;
  desktop?: IStreamingPlansCarouselProps;
};

export type IStreamingPlansGroupClassName = {
  wrapper?: string;
  titleContainer?: string;
  title?: string;
  subtitle?: string;
  cardsContainer?: string;
  carousel?: string;
};

export interface IStreamingPlansProps {
  title: ITextConfig;
  subtitle?: ITextConfig;
  plans: IStreamingPlanCard[];
  layout?: IStreamingPlansLayout;
  carousel?: IStreamingPlansCarouselConfig;
  className?: IStreamingPlansGroupClassName;
  cardClassName?: IStreamingPlanCardClassName;
}
