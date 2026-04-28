import { OfferCardStyle } from "./style";
import type { TOfferCardProps } from "@shared-ui/interfaces/cards/offer";
import { Link } from "@shared-ui/components/link";
import { Icon } from "@shared-ui/components/icons";
import type { FC } from "react";
import clsx from "clsx";

export const OfferCard: FC<TOfferCardProps> = ({
  className,
  image,
  price,
  title,
  description,
  link,
  offerHref
}) => {
  const {
    base,
    imgStyle,
    containerInfo,
    priceStyle,
    titleStyle,
    descriptionStyle,
    linkStyle,
    arrowIcon
  } = OfferCardStyle();
  const hasPrice = typeof price === "number";

  return (
    <div className={clsx(base(), className?.base)} data-testid="offer-card">
      <img
        {...image}
        className={clsx(imgStyle(), className?.img)}
        alt={image?.alt ?? "offerCard"}
        data-testid="offer-card-img"
      />
      <div
        className={clsx(containerInfo(), className?.containerInfo)}
        data-testid="offer-card-info"
      >
        {hasPrice && (
          <span
            className={clsx(priceStyle(), className?.price)}
            data-testid="offer-card-price"
          >
            ${price.toFixed(2)}
          </span>
        )}
        <strong
          className={clsx(titleStyle(), className?.title)}
          data-testid="offer-card-title"
        >
          {title}
        </strong>
        <p
          className={clsx(descriptionStyle(), className?.description)}
          data-testid="offer-card-description"
        >
          {description}
        </p>

        {offerHref && (
          <Link
            {...link}
            href={offerHref.href}
            className={{ base: clsx(linkStyle(), className?.link) }}
            data-testid="offer-card-cta-link"
          >
            {offerHref.titleHref}
            <Icon
              name="keyboard_arrow_right"
              className={{ base: clsx(arrowIcon(), className?.arrowIcon) }}
              color="text-primary-800"
              type="rounded"
              size="msm"
            />
          </Link>
        )}
      </div>
    </div>
  );
};
