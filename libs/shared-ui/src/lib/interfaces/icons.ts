import type { IconStyle } from "@shared-ui/components/icons/style";
import type { VariantProps } from "tailwind-variants";

type IconsVariants = VariantProps<typeof IconStyle>;

export interface IIconsClassName {
  base?: string;
}

export interface IIconProps extends IconsVariants {
  dataTestid?: string;
  name: string;
  className?: IIconsClassName;
  color?: string;
}
