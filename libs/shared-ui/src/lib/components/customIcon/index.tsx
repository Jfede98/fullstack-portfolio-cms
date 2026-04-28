import type { FC } from "react";
import clsx from "clsx";
import type { ICustomIconProps } from "@shared-ui/interfaces/customIcon";

export const CustomIcon: FC<ICustomIconProps> = ({
  name,
  imageUrl,
  imageAlt,
  size = 32,
  className
}) => {
  return (
    <img
      src={imageUrl}
      alt={imageAlt ?? name}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={clsx("object-contain", className)}
    />
  );
};
