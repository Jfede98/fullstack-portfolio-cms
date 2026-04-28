import type { BadgeStyle } from "@shared-ui/components/badge/style";
import type { VariantProps } from "tailwind-variants";

type BadgeVariants = VariantProps<typeof BadgeStyle>;
export interface IBadgeClassName {
  base?: string;
}

export interface IBadgeProps extends BadgeVariants {
  className?: IBadgeClassName;
  text?: string
}
