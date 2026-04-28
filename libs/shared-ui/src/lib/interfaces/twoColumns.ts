import type { ReactNode } from "react";

export type TwoColumnsBackground = "primary-50" | "white";

export type TwoColumnsWidth =
  | `${number}%`
  | `${number}px`
  | `${number}rem`
  | `${number}vw`
  | `calc(${string})`
  | `${number}`;

type ITwoColumnsClassName = {
  base?: string;
  container?: string;
  left?: string;
  right?: string;
  divider?: string;
};

export interface ITwoColumnsProps {
  left: ReactNode;
  right: ReactNode;
  background?: TwoColumnsBackground;
  className?: ITwoColumnsClassName;
  showDivider?: boolean;
  dividerColor?: string;
  leftWidth?: TwoColumnsWidth;
  rightWidth?: TwoColumnsWidth;
}
