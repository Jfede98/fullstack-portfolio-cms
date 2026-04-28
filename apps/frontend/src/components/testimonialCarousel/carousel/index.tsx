import { IPlanCarouselTestimonial } from "@interfaces/planCarousel";
import { Slide } from "../slide";
import { type FC } from "react";
import { Carousel } from "@sitio-publico/shared-ui";

export const CarouselTestimonial: FC<{ 
  data: IPlanCarouselTestimonial[];
  compact?: boolean;
}> = ({
  data,
  compact = false
}) => {
  const arrowGutterClass =
    "max-md:[&_.left-4[data-testid='arrow-container']]:!left-0 max-md:[&_.left-4[data-testid='arrow-container']]:!-translate-x-1/2 max-md:[&_.left-4[data-testid='arrow-container']]:!z-20 max-md:[&_div[data-testid='arrow-container']]:!w-7.5 max-md:[&_div[data-testid='arrow-container']]:!h-7.5 max-md:[&_div[data-testid='arrow-container']_div[data-testid='arrow-icon']]:!w-2 max-md:[&_div[data-testid='arrow-container']_div[data-testid='arrow-icon']]:!h-2";

  // Custom arrow styles for testimonials
  const customArrowStyles = {
    leftArrow: {
      className: {
        base: "!bg-transparent !border-2 !border-primary-600 !-left-6 !top-1/2 !-translate-y-1/2",
        icon: "!border-primary-600 !border-white-0"
      }
    },
    rightArrow: {
      className: {
        base: "!bg-transparent !border-2 !border-primary-600 !-right-6 !top-1/2 !-translate-y-1/2", 
        icon: "!border-primary-600 !border-white-0"
      }
    }
  };

  const breakpoints = compact ? {
    480: {
      slidesPerView: 1.2,
      spaceBetween: 16,
      centeredSlides: false
    },
    640: {
      slidesPerView: 1.5,
      spaceBetween: 18,
      centeredSlides: false
    },
    768: {
      slidesPerView: 1.8,
      spaceBetween: 20,
      centeredSlides: false
    },
    1024: {
      slidesPerView: 1,
      spaceBetween: 24,
      centeredSlides: false
    }
  } : {
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
  };

  return (
    <Carousel
      Element={Slide}
      data={data}
      className={{ base: arrowGutterClass }}
      loop={false}
      slidesPerView={compact ? 1 : 1.15}
      spaceBetween={16}
      breakpoints={breakpoints}
      navigation={{
        type: "arrows",
        hiddenArrowOnFirstAndLast: true,
        leftArrow: {
          size: "2xl",
          ...customArrowStyles.leftArrow
        },
        rightArrow: {
          size: "2xl",
          ...customArrowStyles.rightArrow
        }
      }}
    />
  );
};
