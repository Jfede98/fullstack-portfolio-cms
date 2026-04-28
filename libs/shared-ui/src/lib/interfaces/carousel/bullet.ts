import type { VariantProps } from "tailwind-variants";
import type { BulletStyles } from "@shared-ui/components/carousel/bullet/style";
import type { MouseEvent } from "react";

type IBulletVariants = VariantProps<typeof BulletStyles>;

type BulletClassName = {
  base?: string;
};

export interface IBulletProps extends IBulletVariants {
  className?: BulletClassName;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onEnd?: () => void;
  isPaused?: boolean;
  disabledAnimation?: boolean;
}
