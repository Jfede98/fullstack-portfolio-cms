"use client";

import type { FC } from "react";
import { InfoCardSlider } from "@sitio-publico/shared-ui";

interface InfoCardBlockProps {
  title?: string;
  description?: string;
  cards: Array<{
    image?: string;
    imageAlt?: string;
    title: string;
    description: string;
  }>;
  isFirstBlock?: boolean;
}

export const InfoCardBlock: FC<InfoCardBlockProps> = ({
  title,
  description,
  cards,
  isFirstBlock = false
}) => {
  return (
    <section className={`w-full py-12 ${isFirstBlock ? 'pt-[140px]' : ''}`}>
      <div className="max-w-container mx-auto px-4">
        {title && (
          <h2 className="text-primary-700 text-center mb-4 text-2xl font-bold">
            {title}
          </h2>
        )}
        
        {description && (
          <p className="text-[#6A7180] text-center mb-12">
            {description}
          </p>
        )}
      </div>

      <div className="w-full px-4">
        <div className="max-w-350 mx-auto">
          <InfoCardSlider cards={cards} />
        </div>
      </div>
    </section>
  );
};
