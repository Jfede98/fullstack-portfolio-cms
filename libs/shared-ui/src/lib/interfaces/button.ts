import type { ButtonStyle } from "@shared-ui/components/button/style";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import type { VariantProps } from "tailwind-variants";

type IButtonNaviteProps = Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "className" | "style" | "color" | "type"
>;

type IButtonClassName = {
  base?: string;
  loading?: string;
};

type ButtonVariants = VariantProps<typeof ButtonStyle>;
type TColorVariants = keyof (typeof ButtonStyle)["variants"]["color"];
export type IButtonColorVariants = Record<TColorVariants, string>;

export type ButtonClickEvent = React.MouseEvent<
  HTMLButtonElement | HTMLAnchorElement
>;
export interface IButtonProps extends IButtonNaviteProps, ButtonVariants {
  className?: IButtonClassName;
  type?: "submit" | "button" | "link";
  href?: string;
  loading?: boolean;
  target?: "_blank" | "_self" | "_parent" | "_top";
  disabledRippleEffect?: boolean;
  icon?: string;
  identifier?: number;
}
