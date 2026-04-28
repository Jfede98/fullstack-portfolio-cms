import { type FC } from "react";
import type { SidebarDrawerProps } from "@shared-ui/interfaces/menus/navbar";
import { drawerStyles } from "./style";

export const SidebarDrawer: FC<SidebarDrawerProps> = ({
  isOpen,
  children,
  onClose
}) => {
  const { overlay, content } = drawerStyles({ isOpen });

  return (
    <>
      <div className={`${overlay()}`} onClick={onClose} />
      <div className={`${content()} `}>{children}</div>
    </>
  );
};
