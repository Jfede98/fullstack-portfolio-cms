import type { FC } from "react";
import { FooterRegulatoriosStyle } from "./style";
import clsx from "clsx";
import { Link } from "@shared-ui/components/link";
import { Icon } from "@shared-ui/components/icons";
import type { IRegulatoriosButton } from "@shared-ui/interfaces/menus/footer";

export const RegulatoriosButton: FC<IRegulatoriosButton> = ({
  href,
  label,
  className,
  linkComponent,
  ...props
}) => {
  const { base, iconStyle } = FooterRegulatoriosStyle();
  return (
    <Link
      {...props}
      href={href ?? ""}
      component={linkComponent}
      className={{
        base: clsx(base(), className)
      }}
    >
      <span>{label ?? ""}</span>
      <Icon name="launch" type="outlined" className={{ base: iconStyle() }} />
    </Link>
  );
};
