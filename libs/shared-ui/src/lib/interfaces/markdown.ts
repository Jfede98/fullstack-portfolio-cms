import type { ILink } from "@shared-ui/interfaces/link";

export type IMarkdownClassName = {
  container?: string;
  paragraph?: string;
  link?: string;
  list?: string;
  listItem?: string;
  underline?: string;
  strong?: string;
};

export interface IMarkdownProps {
  desc: string;
  className?: IMarkdownClassName;
  linkProps?: Partial<ILink>;
  variant?: 'default' | 'navbar' | 'footer';
}
