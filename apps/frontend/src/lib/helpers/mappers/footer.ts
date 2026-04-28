"use server";

import type {
  ContactInfo,
  FooterSocialNetwork,
  MenuFooterItem,
  MenuFooterItemLink,
  TStrapiFooter
} from "@interfaces/lib/menu";
import type { IFooterProps } from "@sitio-publico/shared-ui";
import { mapUrlMedia } from "./utils";

const mapContact = (data: ContactInfo[]) => {
  if (!data || data.length === 0) return { items: [] };

  return {
    items: data.map((contact) => ({
      label: contact.label,
      content: contact.content
    }))
  };
};

const mapColumns = (data: MenuFooterItem[]): IFooterProps["links"] => {
  return data.map(({ title, links }) => ({
    title,
    link: links.map(({ label, url, isExternal }) => ({
      label,
      href: url ?? "#",
      target: isExternal ? "_blank" : "_self"
    }))
  }));
};

const mapSocialNetworks = (
  data: FooterSocialNetwork[]
): IFooterProps["socialNetworks"] =>
  data?.map(({ href, logo, target }) => ({
    img: { src: mapUrlMedia(logo) },
    link: {
      href,
      target
    }
  }));

const mapRegulatoriosLink = (
  regulatory?: MenuFooterItemLink
): IFooterProps["linkRegulatorios"] => {
  if (!regulatory) return undefined;

  return {
    label: regulatory.label,
    href: regulatory.url ?? "#",
    target: regulatory.isExternal ? "_blank" : "_self"
  };
};

export const mapFooter = async (data: TStrapiFooter): Promise<IFooterProps> => {
  return {
    info: mapContact(data.contactInfo),
    socialNetworks: mapSocialNetworks(data.socialNetwork),
    links: mapColumns(data.columns),
    linkRegulatorios: mapRegulatoriosLink(data.regulatory),
    linkPolicies: {
      href: data.privacyPolicyLink?.url ?? "#",
      label: data.privacyPolicyLink?.label,
      target: data.privacyPolicyLink?.isExternal ? "_blank" : "_self"
    }
  };
};
