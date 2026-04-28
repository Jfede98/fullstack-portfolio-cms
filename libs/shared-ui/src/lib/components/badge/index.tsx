import type { FC } from "react";
import type { IBadgeProps } from "@shared-ui/interfaces/badge";
import { BadgeStyle } from "./style";
import clsx from "clsx";

export const Badge: FC<IBadgeProps> = (args) => {
  const { className, text, color, isFeatured } = args;
  const badgeStyle = BadgeStyle({ color, isFeatured });

  return <span data-testid="badge" className={clsx(badgeStyle, className?.base)}>{text}</span>;
};
