import { type FC, useState } from "react";
import { ItemsNavbarStyle } from "./style";
import type { IDropdownNavbarProps } from "@shared-ui/interfaces/menus/navbar";
import { Link } from "@shared-ui/components/link";
import { Icon } from "@shared-ui/components/icons";
import { SubItems } from "../subitems";
import clsx from "clsx";

export const ItemsNavbar: FC<IDropdownNavbarProps> = ({ links, linkComponent }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { base, item, triggerLinkItem, tiggerLinkContent, triggerIcon } = ItemsNavbarStyle();

  const handleMouseEnter = (idx: number) => {
    setOpenIndex(idx);
  };

  const handleMouseLeave = () => {
    setOpenIndex(null);
  };

  const handleClick = (idx: number) => {
    setOpenIndex(idx);
  };

  return (
    <ul className={base()}>
      {links?.map((node, idx) => {
        const isOpen = openIndex === idx;
        const hasSublinks = node.links && node.links.length > 0;
        const hasChildren = !!node.children;

        return (
          <li 
            key={idx} 
            className={item()} 
            tabIndex={0}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
            onClick={() => hasSublinks || hasChildren ? handleClick(idx) : undefined}
          >
            {node.link?.href ? (
              <Link {...node.link} component={linkComponent} className={{ base: triggerLinkItem() }}>
                {node.label}
              </Link>
            ) : (
              <div className={tiggerLinkContent()}>
                <span>{node.label}</span>
                <Icon
                  name="keyboard_arrow_down"
                  size="msm"
                  className={{ base: clsx(triggerIcon(), isOpen && "rotate-180") }}
                />
              </div>
            )}
            <SubItems {...node} linkComponent={linkComponent} isOpen={isOpen} />
          </li>
        );
      })}
    </ul>
  );
};
