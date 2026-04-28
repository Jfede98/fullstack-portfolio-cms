import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";
import { CardStyle } from "@shared-ui/components/cards/base/style.ts";
import type { IconStyle } from "@shared-ui/components/icons/style.ts";

type IconsVariants = VariantProps<typeof IconStyle>;
type CardVariants = VariantProps<typeof CardStyle>;

type ICardClassName = {
  base?: string;
};
export interface IIconStyleProps extends IconsVariants {
  color?: string;
}

export interface ICardProps extends CardVariants {
  dataTestid?: string;
  children: ReactNode;
  className?: ICardClassName;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  onClick?: () => void;
}
