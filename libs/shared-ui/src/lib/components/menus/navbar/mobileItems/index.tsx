import { linksMapperNavbar } from "@shared-ui/helpers/menus";
import { type FC, useMemo } from "react";
import { Accordion } from "@shared-ui/components/accordion";
import { MobileListItemsStyle } from "./style";
import type { IDropdownNavbarProps } from "@shared-ui/interfaces/menus/navbar";

export const MobileListItems: FC<IDropdownNavbarProps> = ({
  linkComponent,
  links
}) => {
  const {
    baseAccordion,
    baseDropdown,
    triggerDropdown,
    titleSectionStyle,
    itemStyle,
    linkStyle,
    linkItemWhitoutDropdown
  } = MobileListItemsStyle();

  const items = useMemo(
    () => linksMapperNavbar(links, linkItemWhitoutDropdown()),
    [links, linkItemWhitoutDropdown]
  );

  return (
    <Accordion
      isExclusive
      className={{
        base: baseAccordion(),
        dropdown: {
          base: baseDropdown(),
          trigger: triggerDropdown(),
          title: titleSectionStyle()
        },
        mardown: {
          listItem: itemStyle()
        }
      }}
      linkProps={{
        component: linkComponent,
        className: {
          base: linkStyle(),
          wrapper: "w-full"
        }
      }}
      items={items}
      markdownVariant="navbar"
    />
  );
};
