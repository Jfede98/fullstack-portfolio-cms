import { type FC } from "react";
import { NavbarTabStyle } from "./style";
import { Icon } from "@shared-ui/components/icons";
import { Link } from "@shared-ui/components/link";
import type { ILinkNavbarTop } from "@shared-ui/interfaces/menus/navbar";
import clsx from "clsx";

export const TopNavbarTab: FC<{ links: ILinkNavbarTop[] }> = ({ links }) => {
  const { base, containerList, wrapperItem } = NavbarTabStyle();

  return (
    <nav className={base()} role="navigation">
      <div className={containerList()}>
        {links?.map(({ label, icon, ...link }, idx) => (
          <Link
            key={idx}
            {...link}
            className={{
              base: clsx(wrapperItem(), idx === 0 && "bg-primary-500!")
            }}
          >
            {icon && (
              <Icon
                {...icon}
                size={icon?.size ?? "msm"}
                type={icon?.type ?? "rounded"}
              />
            )}
            <span className="block">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
