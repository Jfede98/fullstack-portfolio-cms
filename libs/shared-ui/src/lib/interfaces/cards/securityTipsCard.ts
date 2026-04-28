import type { IIconStyleProps } from "@shared-ui/interfaces/cards/cards.ts";

type ISecurityTipsCardClassName = {
  container?: string;
  title?: string;
  description?: string;
  link?: string;
};

export interface ISecurityTipsCardProps {
  title?: string;
  description?: string;
  linkText?: string;
  href?: string;
  iconName?: string;
  icon?: IIconStyleProps;
  linkIconName?: string;
  linkIcon?: IIconStyleProps;
  className?: ISecurityTipsCardClassName;
}
