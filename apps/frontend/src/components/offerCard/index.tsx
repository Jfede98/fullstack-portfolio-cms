"use client";

import { OfferCard } from "@sitio-publico/shared-ui";
import Link from "next/link";
import { OfferCardStyle } from "./style";
import { type FC } from "react";
import type { TOfferNavbarCard } from "@interfaces/components/offerNavbar";

export const OfferNavbarCard: FC<TOfferNavbarCard> = ({ title, cards }) => {
  const { base, titleStyle, containerCards } = OfferCardStyle();

  return (
    <section className={base()}>
      {title && (
        <span className={titleStyle()}>
          {title}
        </span>
      )}
      <div className={containerCards()}>
        {cards.map((card, idx) => (
          <OfferCard
            key={idx}
            {...card}
            link={
              card.offerHref
                ? {
                    component: Link,
                    href: card.offerHref.href
                  }
                : undefined
            }
            className={{ base: "lg:min-w-62.5" }}
          />
        ))}
      </div>
    </section>
  );
};
