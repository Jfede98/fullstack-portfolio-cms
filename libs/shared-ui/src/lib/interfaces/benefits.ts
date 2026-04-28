import type { VariantProps } from "tailwind-variants";
import type { IconStyle } from "@shared-ui/components/icons/style";
import type { ITextConfig } from "@shared-ui/interfaces/typography";

type IconsVariants = VariantProps<typeof IconStyle>;

export interface IIconStyleProps extends IconsVariants {
  color?: string;
}

type IBenefitsClassName = {
  base?: string;
  titleStyle?: string;
  benefitsContainerStyle?: string;
  benefitsTitleStyle?: string;
  benefitsDescriptionStyle?: string;
  benefitsIconContainer?: string;
  benefitItemStyle?: string;
  benefitContentStyle?: string;
};

export type BenefitsLayout = "horizontal" | "vertical";

export interface IBenefitsProps {
  title?: ITextConfig;
  benefits: IBenefitsItems[];
  icon?: IIconStyleProps;
  layout?: BenefitsLayout;
  className?: IBenefitsClassName;
}

export interface IBenefitsItems {
  icon: string;
  title: string;
  description: string;
  href?: string;
  isExternal?: boolean;
  identifier?: number;
  color?: string;
  onClick?: () => void;
}
