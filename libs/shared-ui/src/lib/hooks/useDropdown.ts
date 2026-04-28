import { useState } from "react";
import type { IDropdownProps } from "../interfaces";

export const useDropdown = ({
  onActive,
  active: activeProp
}: Pick<IDropdownProps, "onActive" | "active">) => {
  const [internalActive, setInternalActive] = useState(false);
  const active = activeProp !== undefined ? activeProp : internalActive;

  const toggleActive = () => {
    if (activeProp !== undefined) return onActive?.(!active);
    setInternalActive(!active);
    onActive?.(!active);
  };

  const closeDropdown = () => {
    if (activeProp !== undefined) return onActive?.(false);
    setInternalActive(false);
    onActive?.(false);
  };

  return {
    active,
    toggleActive,
    closeDropdown
  };
};
