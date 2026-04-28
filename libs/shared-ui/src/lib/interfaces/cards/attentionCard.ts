import type { IIconStyleProps } from "@shared-ui/interfaces/cards/cards.ts";
import type { IButtonProps } from "../button";

type IAttentionCardClassName = {
  container?: string;
  title?: string;
  text?: string;
  button?: string;
};

export interface IAttentionCardProps {
  iconName: string;
  title: string;
  text: string;
  button?: IButtonProps;
  icon?: IIconStyleProps;
  className?: IAttentionCardClassName;
  href?: string;
}
