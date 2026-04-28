"use client";

import type { FC } from "react";
import { Carousel } from "@shared-ui/components/carousel/base";
import { InfoCard } from "@shared-ui/components/cards/infoCard";
import type { IInfoCardSliderProps } from "@shared-ui/interfaces/infoCardSlider";
import { InfoCardSliderStyle } from "./style";

export const InfoCardSlider: FC<IInfoCardSliderProps> = ({ cards }) => {
  const { container } = InfoCardSliderStyle();
  
  // En móvil (< 1024px) siempre usar slider
  // En desktop, si hay 4 o menos cards, mostrar en grid centrado
  const shouldUseGrid = cards.length <= 4;

  return (
    <div className={container()}>
      {/* Grid para desktop cuando hay ≤ 4 cards */}
      {shouldUseGrid && (
        <div className="hidden lg:block">
          <div className={`grid ${
            cards.length === 1 ? 'grid-cols-1' :
            cards.length === 2 ? 'grid-cols-2' :
            cards.length === 3 ? 'grid-cols-3' :
            'grid-cols-4'
          } gap-6 justify-items-center place-content-center ${
            cards.length === 4 ? 'max-w-full' : 'max-w-[1200px]'
          } mx-auto px-4`}>
            {cards.map((card, index) => (
              <div key={index} className="w-full max-w-[280px]">
                <InfoCard {...card} />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Slider para móvil/tablet o cuando hay > 4 cards */}
      <div className={shouldUseGrid ? 'block lg:hidden' : 'block'}>
        <Carousel
          Element={InfoCard}
          data={cards}
          slidesPerView={1.2}
          spaceBetween={16}
          breakpoints={{
            576: {
              slidesPerView: 1.5,
              spaceBetween: 16
            },
            768: {
              slidesPerView: 2.2,
              spaceBetween: 20
            },
            1024: {
              slidesPerView: shouldUseGrid ? 3.2 : 3.2,
              spaceBetween: 20
            },
            1400: {
              slidesPerView: shouldUseGrid ? 4 : 4,
              spaceBetween: 24
            }
          }}
        />
      </div>
    </div>
  );
};
