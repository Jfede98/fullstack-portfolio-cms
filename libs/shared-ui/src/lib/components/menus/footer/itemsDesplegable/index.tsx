import { linksMapperFooter } from "@shared-ui/helpers/menus";
import { useMemo, type FC } from "react";
import { Accordion } from "@shared-ui/components/accordion";
import type { ILinkSectionDesplegable } from "@shared-ui/interfaces/menus/footer";
import { FooterItemsDesplegableStyle } from "./style";

export const ItemsDesplegables: FC<ILinkSectionDesplegable> = ({
  linkComponent,
  links
}) => {
  const linksItems = useMemo(() => linksMapperFooter(links), [links]);

  if (!linksItems || linksItems.length === 0) return null;

  const {
    accordionBase,
    dropdownBase,
    dropdownTrigger,
    dropdownTitle,
    accordionLinkStyle
  } = FooterItemsDesplegableStyle();

  return (
    linksItems && (
      <Accordion
        isExclusive
        className={{
          base: accordionBase(),
          dropdown: {
            base: dropdownBase(),
            trigger: dropdownTrigger(),
            title: dropdownTitle()
          }
        }}
        linkProps={{
          component: linkComponent,
          className: {
            base: accordionLinkStyle()
          }
        }}
        items={linksItems}
        markdownVariant="footer"
      />
    )
  );
};
