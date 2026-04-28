import { CardStyle } from "@shared-ui/components/cards/base/style";
import type { ICardProps } from "@shared-ui/interfaces/cards/cards.ts";
import type { FC } from "react";
import clsx from "clsx";

export const Card: FC<ICardProps> = ({
  children,
  className,
  border = "gray",
  backgroundColor = "white",
  href,
  dataTestid,
  target,
  rel,
  ariaLabel,
  onClick
}) => {
  const baseStyle = CardStyle({ border, backgroundColor });

  if (href) {
    return (
      <a
        data-testid={dataTestid}
        className={clsx(baseStyle, className?.base)}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        data-testid={dataTestid}
        className={clsx(baseStyle, className?.base)}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={clsx(baseStyle, className?.base)} data-testid={dataTestid}>
      {children}
    </div>
  );
};
