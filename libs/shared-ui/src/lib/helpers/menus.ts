import type { ILinksMapper } from "@shared-ui/interfaces/menus/footer";
import type {
  ILinksMapperNavbar,
  ILinksMapperNavbarResponse
} from "@shared-ui/interfaces/menus/navbar";
import { clsx } from "clsx";

export const linksMapperFooter: ILinksMapper = (links) =>
  links?.map(({ title, link }) => {
    const linkList = link?.map(
      ({ href, label }) => `\n- [${label}](${href})`
    ) ?? [""];

    return {
      title: title ?? "",
      description: linkList?.join(" ") ?? ""
    };
  });

export const linksMapperNavbar: ILinksMapperNavbar = (
  links = [],
  linkClassName
) => {
  const items: ILinksMapperNavbarResponse[] = [];

  for (const element of links) {
    const { label: title, links, link, children } = element;

    if (children) {
      items.push({
        title: title ?? "",
        children: children
      });
      continue;
    }

    if (link) {
      items.push({
        title: title ?? "",
        link: {
          ...link,
          className: {
            base: clsx(link?.className?.base ?? "", linkClassName)
          }
        },
        hiddenArrowIcon: true
      });

      continue;
    }

    const linkList =
      links?.map(
        ({ href, label, icon }) =>
          `\n- \`${icon ? `icon:${icon.name}` : ""}\` [${label}](${href})`
      ) ?? [];

    items.push({
      title: title ?? "",
      description: linkList?.join(" ") ?? ""
    });
  }

  return items;
};
