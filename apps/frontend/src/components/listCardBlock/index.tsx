"use client";

import type { FC } from "react";
import { ListCard } from "@sitio-publico/shared-ui";

interface ListCardBlockProps {
  title?: string;
  cards: Array<{
    title: string;
    items: string;
  }>;
}

export const ListCardBlock: FC<ListCardBlockProps> = ({ title, cards }) => {
  return (
    <section className="w-full py-12 bg-[#F6F6F6]">
      <div className="max-w-container mx-auto px-4">
        {title && (
          <h2 className="text-primary-700 text-center mb-12 text-2xl font-bold">
            {title}
          </h2>
        )}

        <div className="flex flex-col md:flex-row gap-6 md:gap-[27px] justify-center items-center md:items-start max-w-[975px] mx-auto">
          {cards.map((card, index) => (
            <ListCard
              key={index}
              title={card.title}
              items={card.items.split('\n').filter(item => item.trim())}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
