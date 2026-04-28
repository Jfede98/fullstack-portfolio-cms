import type { CollectionType } from "@lib/constants/state";
import type {
  TDocumentId,
  TId,
  TMediaImage,
  TTimestamps
} from "./strapi/modules";
import type {
  StrapiButton,
  StrapiComponentIcon,
  StrapiComponentLink
} from "./strapi/strapi";
import type { IFooterProps, INavbarProps } from "@sitio-publico/shared-ui";

export type GetMenuRequest = {
  collection?: CollectionType;
};

export type TGetMenu = <T extends TStrapiNavbar | TStrapiFooter>(
  req: GetMenuRequest
) => Promise<T>;

export type TGetRootMenus = () => Promise<{
  navbar: INavbarProps;
  footer: IFooterProps;
}>;

/** Navbar */
export type MenuItemType = "list" | "cards" | "simple";

export type StrapiNavbarMenuItem = TId &
  StrapiComponentLink & {
    type?: MenuItemType;
    icon?: StrapiComponentIcon | null;
    titleCards?: string;
    promoCards?: StrapiNavbarPromoCards[];
    menuItems?: StrapiNavbarMenuItem[];
  };

export type StrapiNavbarPromoCards = TId & {
  title: string;
  subtitle: string;
  price?: number | null;
  href?: string;
  titleHref?: string;
  image: TMediaImage | null;
};

export type TStrapiNavbar = TId &
  TTimestamps &
  TDocumentId & {
    topNavigation: StrapiComponentLink[];
    logo: TMediaImage | null;
    menuItems: StrapiNavbarMenuItem[];
    ctaButton: StrapiButton;
    loginButton: StrapiComponentLink;
  };

/** Footer */

export type ContactInfo = TId & {
  label: string;
  content: string;
};

export type MenuFooterItemLink = TId & {
  label: string;
  url: string | null;
  isExternal: boolean;
  isButton: boolean;
};

export type MenuFooterItem = TId & {
  title: string;
  links: MenuFooterItemLink[];
};

export type FooterSocialNetwork = TId & {
  href: string;
  target: "_blank" | "_self";
  logo: TMediaImage;
};

export type TStrapiFooter = TId &
  TDocumentId &
  TTimestamps & {
    copyrightText: string;
    contactInfo: ContactInfo[];
    socialNetwork: FooterSocialNetwork[];
    columns: MenuFooterItem[];
    privacyPolicyLink: MenuFooterItemLink;
    regulatory?: MenuFooterItemLink;
  };
