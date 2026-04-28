import { type FC } from "react";
import { SubItemsStyle } from "./style";
import type { ISubItems } from "@shared-ui/interfaces/menus/navbar";
import { Link } from "@shared-ui/components/link";
import { Icon } from "@shared-ui/components/icons";

export const SubItems: FC<ISubItems & { isOpen?: boolean }> = ({
  linkComponent,
  isOpen = false,
  ...node
}) => {
  const hasSublinks = node.links && node.links.length > 0;
  if (!(hasSublinks || node.children)) return null;

  const { dropdown, dropdownItem } = SubItemsStyle({ isOpen });

  return (
    <div className={dropdown()}>
      {node.children ? (
        node.children
      ) : (
        <div className="flex flex-col">
          {node.links?.map((sublink, subIdx) => (
            <Link
              key={subIdx}
              {...sublink}
              href={sublink.href}
              component={linkComponent}
              className={{ base: dropdownItem() }}
            >
              {sublink?.icon && (
                <Icon
                  {...sublink.icon}
                  size={sublink.icon?.size ?? "msm"}
                  type={sublink.icon?.type ?? "outlined"}
                />
              )}
              <span className="text-sm font-medium">{sublink.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
