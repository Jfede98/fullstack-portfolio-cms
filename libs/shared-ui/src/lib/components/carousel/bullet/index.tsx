import type { FC } from "react";
import clsx from "clsx";
import type { IBulletProps } from "@shared-ui/interfaces/carousel/bullet";
import { BulletStyles } from "./style";

export const Bullet: FC<IBulletProps & { duration?: number }> = ({
  className,
  active,
  duration = 3000,
  onClick,
  onEnd,
  isPaused,
  disabledAnimation = false
}) => {
  const bulletStyles = BulletStyles({ active, animation: !disabledAnimation && active });

  return (
    <div
      key={active ? `active-${duration}` : "inactive"}
      data-testid={active ? "bullet-active" : "bullet-inactive"}
      className={clsx(
        bulletStyles,
        className?.base,
        active && isPaused && "animate-bullet-paused"
      )}
      onClick={onClick}
      onAnimationEnd={() => {
        if (active && onEnd) onEnd();
      }}
      style={
        {
          "--bullet-duration": `${duration}ms`
        } as React.CSSProperties
      }
    />
  );
};
