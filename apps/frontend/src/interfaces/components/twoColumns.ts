import type {
  TwoColumnsBackground,
  TwoColumnsWidth
} from "@shared-ui/interfaces/twoColumns";
import type { ReactNode } from "react";

type ITwoColumnsBlockClassName = {
  base?: string;
  container?: string;
  left?: string;
  right?: string;
  divider?: string;
};

export interface ITwoColumnsBlockProps {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  backgroundVariant?: TwoColumnsBackground;
  showDivider?: boolean;
  dividerColor?: string;
  leftWidth?: TwoColumnsWidth;
  rightWidth?: TwoColumnsWidth;
  className?: ITwoColumnsBlockClassName;
}
