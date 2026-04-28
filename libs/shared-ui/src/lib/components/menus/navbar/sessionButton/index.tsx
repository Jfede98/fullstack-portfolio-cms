import { type FC } from "react";
import { Link } from "@shared-ui/components/link";
import { Icon } from "@shared-ui/components/icons";
import { SessionButtonStyle } from "./style";
import type { ILinkSessionLink } from "@shared-ui/interfaces/menus/navbar";

export const SessionLink: FC<ILinkSessionLink> = ({
  icon,
  label,
  href,
  onClick,
  linkComponent
}) => {
  const { base, text } = SessionButtonStyle();

  return (
    <Link
      href={href ?? "#"}
      component={linkComponent}
      onClick={onClick}
      className={{ base: base() }}
    >
      {icon && (
        <Icon
          {...icon}
          name={icon?.name ?? "person"}
          type={icon?.type ?? "outlined"}
          size={icon?.size ?? "msm"}
        />
      )}
      <span className={text()}>{label}</span>
    </Link>
  );
};
