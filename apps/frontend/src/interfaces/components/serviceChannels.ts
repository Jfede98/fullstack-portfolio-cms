import type { IFeatureItem } from "./features";
import type { TypographyData } from "./typography";

export interface IServiceChannel extends Omit<IFeatureItem, "description"> {
  text?: string;
  button?: {
    label?: string;
    href?: string | null;
    variant?: string;
    type?: string;
  } | null;
}

export interface IShortcutItem {
  id?: number;
  label?: string;
  href?: string | null;
  isExternal?: boolean;
  icon?: {
    id?: number;
    name?: string;
    type?: string;
    size?: string;
  } | null;
}

export interface IShortcutsWidget {
  __component: string;
  items?: IShortcutItem[];
}

export interface IServiceChannelsProps {
  id?: number;
  title?: TypographyData;
  channels?: IServiceChannel[];
  widget?: {
    id?: number;
    name?: string;
    widget?: IShortcutsWidget[];
  };
}
