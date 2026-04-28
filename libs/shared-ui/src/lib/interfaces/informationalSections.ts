import type { ITextConfig } from "@shared-ui/interfaces/typography";
import type { IButtonProps } from "@shared-ui/interfaces/button";

export interface IStreamingPlanCardProps extends IInformationalSection {
  className?: IInformationalSectionClassName;
}

export type IInformationalSectionClassName = {
  wrapper?: string;
  titleStyle?: string;
  subtitleStyle?: string;
  descriptionStyle?: string;
  ctaStyle?: string;
  imageContainer?: string;
  imageStyle?: string;
  textContainer?: string;
};

export interface IInformationalSection {
  title: ITextConfig;
  subtitle?: ITextConfig;
  description: string;
  cta?: IButtonProps;
  image: {
    src: string;
    alt?: string;
  };
}