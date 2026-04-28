"use server";

import type {
  MenuItemType,
  StrapiNavbarMenuItem,
  StrapiNavbarPromoCards,
  TStrapiNavbar
} from "@interfaces/lib/menu";
import type {
  StrapiComponentLink,
  StrapiButton
} from "@interfaces/lib/strapi/strapi";
import { mapIcon, mapUrlMedia } from "./utils";
import { OfferNavbarCard } from "@components/offerCard";
import { type INavbarProps } from "@sitio-publico/shared-ui";
import type { TOfferNavbarCard } from "@interfaces/components/offerNavbar";
import type { TMediaImage } from "@interfaces/lib/strapi/modules";
import { mapButton } from "./button";

const mapButtonContact = (data?: StrapiButton) => {
  const mappedButton = mapButton(data);
  if (!mappedButton) return undefined;

  return {
    ...mappedButton,
    href: mappedButton.href ?? "#",
  };
};

const mapSessionLink = (data: StrapiComponentLink) => ({
  label: data?.label,
  icon: mapIcon(data?.icon),
  href: data?.href ?? "#",
  target: data?.isExternal ? "_blank" : "_self"
});

const mapListLink = (data: StrapiNavbarMenuItem[]) =>
  data.map(({ isExternal = false, href, label, icon }) => ({
    href: href ?? "#",
    target: isExternal ? "_blank" : "_self",
    label,
    icon: icon && mapIcon(icon)
  }));

const mapSectionLink = (data: StrapiNavbarMenuItem[], type?: MenuItemType) => {
  if (type !== "list") return undefined;
  return mapListLink(data);
};

const mapLogo = (data: TMediaImage | null) => ({
  src: mapUrlMedia(data),
  alt: data?.caption ?? "Logo",
  className: "block object-contain"
});

const mapOfferCards = (
  data: StrapiNavbarPromoCards[],
  titleCards?: string
): TOfferNavbarCard => ({
  title: titleCards,
  cards: data.map((item) => ({
    price: item.price ?? null,
    title: item.title,
    description: item.subtitle,
    image: {
      src: mapUrlMedia(item.image),
      alt: item.image?.caption ?? "offer"
    },
    offerHref: {
      href: item.href ?? "#",
      titleHref: item.titleHref
    }
  }))
});

const mapTopNavbar = (data: StrapiComponentLink[]): INavbarProps["navbarTop"] =>
  data.map(({ label, href, icon, isExternal }) => ({
    href: href ?? "",
    label,
    target: isExternal ? "_blank" : "_self",
    icon: mapIcon(icon)
  }));

const mapColumnLinks = <
  T extends INavbarProps["links"] = INavbarProps["links"]
>(
  data: StrapiNavbarMenuItem[]
) =>
  data.map(({ label, href, type, menuItems, promoCards, titleCards, isExternal }) => ({
    label,
    link:
      href && type === "simple"
        ? { href, target: isExternal ? "_blank" : "_self" }
        : undefined,
    links: mapSectionLink(menuItems ?? [], type),
    children:
      type === "cards" ? (
        <OfferNavbarCard {...mapOfferCards(promoCards ?? [], titleCards)} />
      ) : undefined
  })) as T;

export const mapNavbar = async (
  data: TStrapiNavbar
): Promise<INavbarProps> => ({
  logo: mapLogo(data.logo),
  sessionLink: mapSessionLink(data.loginButton),
  buttonContact: mapButtonContact(data.ctaButton),
  navbarTop: mapTopNavbar(data.topNavigation),
  links: mapColumnLinks(data.menuItems)
});
