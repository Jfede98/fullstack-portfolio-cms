import { tv } from "tailwind-variants";

export const CarouselStyles = tv({
  slots: {
    base: ["relative", "h-full", "w-full"],
    swiper: ["swiper"],
    wrapper: ["swiper-wrapper", "!items-stretch"],
    slide: ["swiper-slide", "!h-auto"],
    paginationStyle: [
      "mt-4",
      "flex",
      "justify-center",
      "gap-2",
      "absolute",
      "bottom-8",
      "z-10",
      "left-0",
      "right-0",
      "mx-auto"
    ],
    navigationStyle: [
      "absolute",
      "w-fit",
      "z-10",
      "bottom-8",
      "mx-auto",
      "left-0",
      "right-0"
    ],
    navigationArrowStyle: [
      "!absolute",
      "z-10",
      "top-1/2",
      "-translate-y-1/2",
      "transform"
    ]
  },
  variants: {
    arrowLeft: {
      true: {
        navigationArrowStyle: ["left-4"]
      },
      false: {
        navigationArrowStyle: ["right-4"]
      }
    },
    hiddenArrow: {
      true: {
        navigationArrowStyle: ["hidden"]
      }
    },
    pagginationHidden: {
      true: {
        paginationStyle: ["z-0"]
      }
    }
  }
});
