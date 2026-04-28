import type { VariantProps } from "tailwind-variants";
import type { IconStyle } from "@shared-ui/components/icons/style";
import type { IButtonProps } from "./button";
import type { ITextConfig } from '@shared-ui/interfaces/typography';

type IconsVariants = VariantProps<typeof IconStyle>;

type ICTABenefitsClassName = {
  wrapper?: string;
  base?: string;
  title?: string;
  subtitle?: string;
  featuresContainer?: string;
  featureItem?: string;
  featureText?: string;
}

export interface IIconStyleProps extends IconsVariants {
  color?: string;
}

export interface ICTABenefitsProps {
  title: ITextConfig;
  subtitle: string;
  backgroundImage?: string;
  features: Feature[];
  icon?: IIconStyleProps;
  button?: IButtonProps;
  className?: ICTABenefitsClassName;
  layout?: "vertical" | "horizontal";
  horizontalAlignment?: "left" | "right";
}

export interface Feature {
  iconName: string;
  text: string;
}
