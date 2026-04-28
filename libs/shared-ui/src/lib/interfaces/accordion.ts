import type { AccordionStyle } from "@shared-ui/components/accordion/style";
import type { VariantProps } from "tailwind-variants";
import type { ILink } from "./link";
import type { IDropdownClassName } from "./dropdown";
import type { IMarkdownClassName } from "./markdown";
import type { ReactNode } from "react";

type AccordionVariants = Omit<VariantProps<typeof AccordionStyle>, "active">;

type IAccordionClassName = {
  base?: string;
  mardown?: IMarkdownClassName;
  dropdown?: IDropdownClassName & {
    title?: string;
    desc?: string;
  };
};

export interface IItem {
  link?: Omit<ILink, "children">;
  title: string;
  description?: string;
  children?: ReactNode;
  hiddenArrowIcon?: boolean;
}

export interface IItemDescription {
  desc: string;
}

export interface IAccordionItemRender extends IItem {
  titleStyle: string;
  descStyle: string;
  dropdownStyle: string;
  dropdownTriggerStyle: string;
}

type ILinkAccordion = Pick<
  ILink,
  "prefetch" | "rel" | "target" | "component" | "className"
>;

export interface IAccordionProps extends AccordionVariants {
  className?: IAccordionClassName;
  items: IItem[];
  isExclusive?: boolean;
  linkProps?: ILinkAccordion;
  markdownVariant?: 'default' | 'navbar' | 'footer';
}
