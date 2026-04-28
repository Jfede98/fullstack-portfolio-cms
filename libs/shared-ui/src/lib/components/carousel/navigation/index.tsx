import type { FC } from "react";
import type { INavigationProps } from "@shared-ui/interfaces/carousel/navigation";
import { NavigationStyles } from "./style";
import { Arrow } from "@shared-ui/components/carousel/arrow";
import { AvatarGroup } from "@shared-ui/components/avatar/group";
import clsx from "clsx";

export const Navigation: FC<INavigationProps> = ({
  buttons,
  text,
  className,
  avatarGroup
}) => {
  const { base, textStyle } = NavigationStyles();

  const leftArrow = buttons?.find((button) => button.direction === "left");
  const rightArrow = buttons?.find((button) => button.direction === "right");

  return (
    <div className={clsx(base(), className?.base)}>
      {leftArrow && <Arrow {...leftArrow} />}
      {avatarGroup && <AvatarGroup {...avatarGroup} />}
      {text && (
        <span className={clsx(textStyle(), className?.text)}>{text}</span>
      )}
      {rightArrow && <Arrow {...rightArrow} />}
    </div>
  );
};
