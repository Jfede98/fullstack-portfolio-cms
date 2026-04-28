import { tv } from "tailwind-variants";

export const HeroStyle = tv({
  slots: {
    base: ["relative", "w-full", "overflow-visible", "h-auto", "z-0"],
    mobileFormContainer: [
      "relative",
      "z-10",
      "-mt-12",
      "flex",
      "justify-center",
      "px-4",
      "lg:hidden"
    ],
    mobileFormWrapper: ["w-full", "max-w-[496px]"],
    navigationContainer: [
      "hidden",
      "lg:flex",
      "absolute",
      "bottom-4",
      "left-1/2",
      "-translate-x-1/2",
      "z-10"
    ],
    swiperContainer: ["relative", "z-10",
      "h-[750px]!",
    ],
    paginationContainer: [
      "absolute",
      "z-30",
      "bottom-20",
      "left-0",
      "right-0",
      "flex",
      "justify-center",
      "gap-2",
      "pointer-events-auto",
      //"lg:hidden",
      "lg:opacity-0",
      "lg:pointer-events-none"
    ]
  },
  variants: {
    existWidget: {
      false: {
        paginationContainer: ["bottom-10!"]
      }
    },
    extraMobileHeight: {
      true: {
        swiperContainer: ["h-[75dvh]!"],
        paginationContainer: ["bottom-24"]
      }
    },
    showWidgetOnDesktop: {
      true: {
        mobileFormContainer: ["lg:flex"]
      },
      false: {
        mobileFormContainer: ["lg:hidden"]
      }
    },
    horizontalFormOnDesktop: {
      true: {
        mobileFormContainer: ["lg:flex", "lg:-mt-16", "lg:px-8"],
        mobileFormWrapper: ["lg:max-w-[860px]"],
        paginationContainer: ["lg:flex"],
        navigationContainer: ["hidden"]
      }
    },
    formWidget: {
      true: {
        mobileFormWrapper: [
          "max-w-[496px]",
          "scale-95",
          "sm:scale-100",
          "md:scale-105"
        ]
      },
      false: {
        mobileFormContainer: [
          "pt-6",
          "lg:pt-0",
          "lg:-mt-[50px]",
          "lg:px-[107px]"
        ],
        mobileFormWrapper: [
          "w-full",
          "max-w-none",
          "scale-100",
          "lg:h-auto",
          "lg:rounded-2xl",
          "lg:border-4",
          "lg:border-white/40",
          "lg:bg-white",
          "lg:py-6",
          "lg:px-8",
          "lg:shadow-[0px_4px_16px_rgba(0,0,0,0.1)]"
        ]
      }
    }
  }
});
