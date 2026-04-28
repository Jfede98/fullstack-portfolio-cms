"use client";

import type { FC } from "react";
import { useState, useEffect } from "react";
import { Card } from "@shared-ui/components/cards/base";
import { Carousel } from "@shared-ui/components/carousel/base";
import { FAQCardsSliderStyle } from "./style";
import type { IFAQCardsSliderProps, IFAQCardData } from "@shared-ui/interfaces/faqCardsSlider";
import clsx from "clsx";

// Componente interno para renderizar cada FAQ card
const FAQCardItem: FC<IFAQCardData> = ({
  question,
  description,
  linkButton
}) => {
  const { cardContent, questionStyle, descriptionStyle, buttonContainer } = FAQCardsSliderStyle();

  return (
    <Card
      className={{ base: "h-full" }}
      dataTestid="faq-card"
    >
      <div className={cardContent()}>
        <h3
          className={questionStyle()}
          data-testid="faq-question"
        >
          {question}
        </h3>
        
        <p
          className={descriptionStyle()}
          data-testid="faq-description"
        >
          {description}
        </p>
        
        <div className={buttonContainer()}>
          {linkButton?.onClick ? (
            <button 
              onClick={linkButton.onClick}
              className="text-primary-700 text-sm font-medium cursor-pointer hover:text-primary-800 flex items-center gap-1 bg-transparent border-none p-0"
              data-testid="faq-link-button"
            >
              <span>{linkButton?.children || linkButton?.label}</span>
              <span>→</span>
            </button>
          ) : (
            <a 
              href={linkButton?.href}
              target={linkButton?.target}
              className="text-primary-700 text-sm font-medium cursor-pointer hover:text-primary-800 flex items-center gap-1"
              data-testid="faq-link-button"
            >
              <span>{linkButton?.children || linkButton?.label}</span>
              <span>→</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export const FAQCardsSlider: FC<IFAQCardsSliderProps> = ({
  title,
  cards,
  className
}) => {
  const { container, titleStyle } = FAQCardsSliderStyle();
  const shouldCenterContent = cards.length <= 3;
  const [isMobile, setIsMobile] = useState<boolean | null>(null); // null hasta que sepamos el tamaño

  // Detectar si es mobile para habilitar/deshabilitar touch
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div className={clsx(container(), className?.container)}>
      {title && (
        <h2
          className={clsx(titleStyle(), className?.title)}
          data-testid="faq-slider-title"
        >
          {title}
        </h2>
      )}
      
      <div className="relative">
        <div className={shouldCenterContent ? "flex justify-center" : "w-full"}>
          <div className={shouldCenterContent ? "flex gap-6" : "w-full"}>
            {shouldCenterContent ? (
              cards.map((card, index) => (
                <div key={index} className="w-80 flex-shrink-0">
                  <FAQCardItem {...card} />
                </div>
              ))
            ) : isMobile === null ? (
              null
            ) : (
              <Carousel
                Element={FAQCardItem}
                data={cards}
                slidesPerView={1.2}
                spaceBetween={16}
                allowTouchMove={isMobile}
                navigation={{
                  type: "arrows",
                  hiddenArrowOnFirstAndLast: true,
                  leftArrow: {
                    size: "md",
                    className: {
                      base: "bg-[#783484] hover:bg-[#6b2d75] shadow-md hover:shadow-lg",
                      icon: "text-[#EDE1F9]"
                    }
                  },
                  rightArrow: {
                    size: "md",
                    className: {
                      base: "bg-[#783484] hover:bg-[#6b2d75] shadow-md hover:shadow-lg",
                      icon: "text-[#EDE1F9]"
                    }
                  }
                }}
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
                    slidesPerView: 3.2,
                    spaceBetween: 24
                  },
                  1256: {
                    slidesPerView: 4,
                    spaceBetween: 24
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};