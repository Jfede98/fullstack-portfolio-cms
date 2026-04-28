import { type FC } from "react";
import { Carousel } from "@sitio-publico/shared-ui";
import { Slide } from "../slide";
import type { IPlanCardData } from "@interfaces/components/planTab";
import { carouselPlanStyle } from "./style";

export const CarouselPlan: FC<{ data: IPlanCardData[] }> = ({ data }) => {
  const plansCount = data?.length ?? 0;
  const recommendedIndex = data.findIndex((plan) => plan.isRecommended);
  const hasRecommended = recommendedIndex >= 0;

  const shouldCenter = plansCount <= 3;
  const shouldCenterMobile = plansCount === 1;
  const arrowGutterClass =
    "max-md:[&_.left-4[data-testid='arrow-container']]:!left-0 max-md:[&_.left-4[data-testid='arrow-container']]:!-translate-x-1/2 max-md:[&_.left-4[data-testid='arrow-container']]:!z-20";
  
  const { wrapper } = carouselPlanStyle({ 
    isCenteredDesktop: shouldCenter,
    isCenteredMobile: shouldCenterMobile
  });

  return (
    <div className={wrapper()}>
      <Carousel
        Element={Slide}
        data={data}
        className={{ base: arrowGutterClass }}
        loop={false}
        on={{
          init: (swiper) => {
            if (hasRecommended && swiper.width < 768) {
              swiper.slideTo(recommendedIndex);
            }
          }
        }}
        slidesPerView={1.15}
        spaceBetween={16}
        breakpoints={{
          480: {
            slidesPerView: 1.75,
            spaceBetween: 16,
            centeredSlides: false
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 18,
            centeredSlides: false
          },
          768: {
            slidesPerView: 2.35,
            spaceBetween: 20,
            centeredSlides: false
          },
          1024: {
            slidesPerView: 3.095,
            spaceBetween: 24,
            centeredSlides: false
          }
        }}
        navigation={{
          type: "arrows",
          hiddenArrowOnFirstAndLast: true,
          leftArrow: {
            size: "2xl"
          },
          rightArrow: {
            size: "2xl"
          }
        }}
      />
    </div>
  );
};
