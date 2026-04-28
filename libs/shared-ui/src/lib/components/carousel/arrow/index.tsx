import type { TArrowProps } from "@shared-ui/interfaces/carousel/arrow";
import { createRipple } from "@shared-ui/helpers/button";
import type { FC } from "react";
import { ArrowStyles } from "./style";
import clsx from "clsx";

export const Arrow: FC<TArrowProps> = ({
  id,
  className,
  direction,
  size,
  disabled = false,
  dataTestid = "arrow-container"
}) => {
  const { base, icon } = ArrowStyles({ direction, size, disabled });

  return (
    <div
      id={id}
      className={clsx(base(), className?.base)}
      data-testid={dataTestid}
      onClick={(e) => {
        if (!disabled) createRipple(e, disabled);
      }}
    >
      <div className={clsx(icon(), className?.icon)} data-testid="arrow-icon" />
    </div>
  );
};
