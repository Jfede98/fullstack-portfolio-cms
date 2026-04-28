import type { VariantProps } from "tailwind-variants";
import { FooterStyle } from "@shared-ui/components/menus/footer/style";
import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import type { ILink } from "@shared-ui/interfaces/link";
import type { ILogoProps } from "@shared-ui/interfaces/logo";

type FooterVariants = VariantProps<typeof FooterStyle>;


type Image = Omit<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  "className" | "style"
>;

type NativeLink = Omit<ILink, "className" | "children">;

export type LinkSocial = {
  img?: Image;
  link?: NativeLink;
};

type FooterLink = Omit<NativeLink, "component"> & {
  label?: string;
};

type LinkSection = {
  title?: string;
  link?: FooterLink[];
};

export type ILinksMapper = (links?: LinkSection[] | undefined) =>
  | {
      title: string;
      description: string;
    }[]
  | undefined;

type Logo = { logo?: ILogoProps; link?: Partial<FooterLink> };

export type ContactInfoItem = {
  label: string;
  content: string;
};

export type IExtraInfo = {
  items?: ContactInfoItem[];
};

export interface ICopyright extends FooterLink {
  linkComponent?: NativeLink["component"];
}

export type ILinkSection = {
  links?: LinkSection[];
  linkComponent?: NativeLink["component"];
  linkRegulatorios?: FooterLink;
};

export type ILinkSectionDesplegable = Omit<ILinkSection, "linkRegulatorios">;

export type IRegulatoriosButton = FooterLink & {
  linkComponent?: NativeLink["component"];
  className?: string;
};

export type TMenuVariant = "default" | "no_items" | "simple" | "none";

export interface IFooterProps extends FooterVariants, ILinkSection {
  logo?: Logo;
  info?: IExtraInfo;
  socialNetworks?: LinkSocial[];
  linkComponent?: NativeLink["component"];
  linkPolicies?: FooterLink;
  footerVariant?: TMenuVariant;
}
