import { tv } from "tailwind-variants";

export const carouselPlanStyle = tv({
  slots: {
    wrapper: [
      "pt-6",
      "md:pt-8",
      "lg:pt-10",
      "pb-4",
      "px-4",
      "md:px-8",
      "lg:px-0",
      "relative",
      "w-full",
      "overflow-x-clip",
      "overflow-y-visible",
      "[&_.swiper]:!overflow-visible",
      "[&_.swiper-wrapper]:overflow-visible",
      "[&_.swiper-wrapper]:!items-start",
      // Flechas más pequeñas en móvil (md = 30px en lugar de 2xl = 48px)
      "[&_div[data-testid='arrow-container']]:max-md:!w-7.5",
      "[&_div[data-testid='arrow-container']]:max-md:!h-7.5",
      "[&_div[data-testid='arrow-container']_div[data-testid='arrow-icon']]:max-md:!w-2",
      "[&_div[data-testid='arrow-container']_div[data-testid='arrow-icon']]:max-md:!h-2"
    ]
  },
  variants: {
    isCenteredDesktop: {
      true: {
        wrapper: [
          "[&_.swiper-wrapper]:md:justify-center"
        ]
      },
      false: {
        wrapper: [
          "[&_.swiper-wrapper]:md:justify-start"
        ]
      }
    },
    isCenteredMobile: {
      true: {
        wrapper: [
          "[&_.swiper-wrapper]:max-md:justify-center"
        ]
      },
      false: {
        wrapper: [
          "[&_.swiper-wrapper]:max-md:justify-start"
        ]
      }
    }
  }
});
