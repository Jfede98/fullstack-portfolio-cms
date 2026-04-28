import type { NavbarStyle } from "@shared-ui/components/menus/navbar/style";
import type { VariantProps } from "tailwind-variants";
import type { ILink } from "@shared-ui/interfaces/link";
import type { IItem } from "../accordion";
import type { DetailedHTMLProps, ImgHTMLAttributes, ReactNode } from "react";
import type { IButtonProps } from "@shared-ui/interfaces/button";
import type { IIconProps } from "../icons";
import type { TMenuVariant } from "@shared-ui/interfaces/menus/footer";

type NavbarVariants = VariantProps<typeof NavbarStyle>;

type NativeLink = Omit<ILink, "className" | "children">;

export type LinkSection = NativeLink & {
  label?: string;
  icon?: IIconProps;
};

export type NavbarLink = Omit<NativeLink, "component" | "href"> & {
  label?: string;
  link?: Omit<ILink, "children" | "component">;
  links?: LinkSection[];
  children?: ReactNode;
};

export type IHamburguerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export interface SidebarDrawerProps extends IHamburguerProps {
  children?: React.ReactNode;
}

export interface IDropdownNavbarProps {
  links?: NavbarLink[];
  linkComponent?: NativeLink["component"];
  sessionLink?: ILinkSessionLink;
  topNavbar?: ILinkNavbarTop[];
}

export type ILinkMapperItem = {
  href: string;
  title: string;
};

export type ILinksMapperNavbarResponse = IItem;

export type ILinkSessionLink = {
  label?: string;
  icon?: IIconProps;
  href?: string;
  onClick?: () => void;
  linkComponent?: NativeLink["component"];
};

export type ISubItems = NavbarLink & {
  linkComponent?: NativeLink["component"];
};

export type ILinksMapperNavbar = (
  links?: NavbarLink[],
  linkClassName?: string
) => ILinksMapperNavbarResponse[];

export type ILinkNavbarTop = Omit<NativeLink, "component" | "className"> & {
  label?: string;
  icon?: IIconProps;
};

type Logo = Omit<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  "style"
>;

export interface INavbarProps extends NavbarVariants, IDropdownNavbarProps {
  logo?: Logo;
  buttonContact?: Omit<IButtonProps, "className">;
  navbarTop?: ILinkNavbarTop[];
  children?: ReactNode;
  navbarVariant?: TMenuVariant;
}
