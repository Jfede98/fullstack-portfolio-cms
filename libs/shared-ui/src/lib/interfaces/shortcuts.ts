import type { IIconStyleProps } from "@shared-ui/interfaces/cards/cards";

export interface IShortcutItem {
  title: string;
  icon: string;
  href: string;
}

type IShortcutsClassName = {
  base?: string;
  itemContainer?: string;
  link?: string;
  icon?: string;
  text?: string;
  arrow?: string;
};

export interface IShortcutsProps {
  items: IShortcutItem[];
  className?: IShortcutsClassName;
  iconProps?: IIconStyleProps;
  arrowIconProps?: IIconStyleProps;
}

