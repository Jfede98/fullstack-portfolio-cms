import type { FC } from "react";
import { AvatarStyles } from "./style";
import type { IAvatarProps } from "@shared-ui/interfaces/avatar/base";
import clsx from "clsx";

export const Avatar: FC<IAvatarProps> = ({
  className,
  size = "lg",
  border = false,
  ...props
}) => {
  const styles = AvatarStyles({ size, border });
  return (
    <img
      className={clsx(styles, className?.base)}
      {...props}
      alt={props?.alt ?? "avatar"}
    />
  );
};
