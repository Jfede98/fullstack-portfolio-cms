import { type FC } from "react";
import { DropdownNavbarStyle } from "./style";
import type { IDropdownNavbarProps } from "@shared-ui/interfaces/menus/navbar";
import { MobileListItems } from "../mobileItems";
import { SessionLink } from "../sessionButton";
import { Link } from "@shared-ui/components/link";
import { Icon } from "@shared-ui/components/icons";

export const DropdownSidebarNavbar: FC<IDropdownNavbarProps> = ({
  linkComponent,
  links,
  sessionLink,
  topNavbar
}) => {
  const { base, divider, topLink, containerTopLink, topLinkInsideContainer } =
    DropdownNavbarStyle();

  return (
    <nav className={base()} role="navigation">
      <div className={containerTopLink()}>
        {topNavbar?.map(({ label, icon, ...f }, idx) => (
          <Link
            key={idx}
            {...f}
            component={linkComponent}
            className={{ wrapper: topLink(), base: topLinkInsideContainer() }}
          >
            {icon && (
              <Icon
                {...icon}
                size={icon?.size ?? "msm"}
                type={icon?.type ?? "rounded"}
              />
            )}
            <span>{label}</span>
          </Link>
        ))}
      </div>
      <hr className={divider()} />
      {sessionLink?.href && sessionLink?.href !== "#" && (
        <SessionLink {...sessionLink} />
      )}
      <MobileListItems linkComponent={linkComponent} links={links} />
    </nav>
  );
};
