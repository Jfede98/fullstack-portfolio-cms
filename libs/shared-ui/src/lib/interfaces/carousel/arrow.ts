import type { VariantProps } from "tailwind-variants";
import type { ArrowStyles } from "@shared-ui/components/carousel/arrow/style";
type TArrowStyles = VariantProps<typeof ArrowStyles>;

type ArrowClassName = {
  base?: string;
  icon?: string;
};

export type TArrowProps = TArrowStyles & {
  dataTestid?: string;
  id?: string;
  direction?: "left" | "right";
  className?: ArrowClassName;
};
