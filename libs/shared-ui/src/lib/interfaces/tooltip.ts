import type { ReactNode } from "react";
import type { tooltipStyles } from "@shared-ui/components/tooltip/style";
import type { VariantProps } from "tailwind-variants";

type TooltipClassName = {
  base?: string;
};

type TooltipVariants = VariantProps<typeof tooltipStyles>;

export interface TooltipProps extends TooltipVariants {
  className?: TooltipClassName;
  content: string;
  children: ReactNode;
}
