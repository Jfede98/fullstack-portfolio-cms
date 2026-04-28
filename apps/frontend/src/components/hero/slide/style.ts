import { tv } from "tailwind-variants";

export const SlideStyle = tv({
  slots: {
    wrapper: ["relative", "w-full", "h-full", "overflow-hidden"],
    backgroundLayer: ["absolute", "inset-0", "-z-10", "h-full", "w-full"],
    backgroundImage: ["h-full", "w-full", "object-cover"],
    container: [
      "flex",
      "h-full",
      "w-full",
      "items-end",
      "justify-center",
      "pt-12",
      "pb-8",
      "lg:items-center",
      "lg:pt-16",
      "lg:pb-8"
    ],
    content: [
      "flex",
      "w-full",
      "max-w-[1224px]",
      "flex-col",
      "gap-6",
      "px-4",
      "mb-20",
      "md:flex-row",
      "lg:items-center",
      "lg:gap-8",
      "lg:px-8",
      "2xl:px-0",
      "lg:mb-0",
      "origin-center",
      "transition-transform"
    ],
    textSection: [
      "flex",
      "w-full",
      "flex-col",
      "gap-4",
      "lg:basis-0",
      "lg:grow",
      "lg:gap-6",
      "lg:shrink-0",
      "max-w-[536px]"
    ],
    titleStyle: ["text-secondary", "leading-tight"],
    subtitleStyle: ["text-primary-50", "leading-tight"],
    featuresGrid: ["flex", "flex-wrap", "gap-4"],
    ctaMobileWrapper: ["flex", "w-full", "justify-start", "lg:hidden"],
    ctaDesktopWrapper: [
      "hidden",
      "lg:flex",
      "lg:items-center",
      "lg:justify-end",
      "lg:basis-0",
      "lg:grow"
    ],
    ctaBelowDesktopWrapper: [
      "hidden",
      "lg:flex",
      "lg:w-full",
      "lg:justify-start"
    ],
    featureCard: [
      "flex",
      "flex-col",
      "items-center",
      "gap-2",
      "p-2",
      "text-white",
      "lg:p-4"
    ],
    featureText: ["text-center", "text-xs", "font-medium", "lg:text-sm"],
    formContainer: [
      "hidden",
      "lg:flex",
      "lg:basis-0",
      "lg:grow",
      "lg:shrink-0",
      "lg:justify-end"
    ],
    cardBase: [
      "w-full",
      "min-w-21",
      "flex-1",
      "leading-none",
      "last:grow",
      "sm:max-w-35"
    ]
  },
  variants: {
    withOverlay: {
      true: {
        container: ["bg-primary-1000/70"]
      },
      false: {
        container: []
      }
    },
    horizontalFormOnDesktop: {
      true: {
        container: ["items-center", "lg:justify-center"],
        content: [
          "mb-0",
          "-mt-[16dvh]",
          "lg:-mt-[30dvh]",
          "lg:justify-center",
          "lg:items-center"
        ],
        textSection: ["lg:items-center", "lg:text-center", "lg:max-w-full"],
        titleStyle: ["lg:text-center"],
        subtitleStyle: ["lg:text-center"],
        featuresGrid: ["lg:justify-center"],
        ctaDesktopWrapper: ["lg:justify-center"],
        formContainer: ["lg:justify-center"]
      }
    },
    variant: {
      default: {},
      light: {
        titleStyle: ["text-[#582C63]"],
        subtitleStyle: ["text-[#0D1B2A]"]
      }
    },
    ctaPosition: {
      side: {},
      below: {
        ctaMobileWrapper: ["flex", "w-full", "justify-start", "lg:hidden"]
      }
    }
  },
  compoundVariants: [
    {
      withOverlay: true,
      variant: "light",
      class: {
        container: ["bg-[#E0E1DDCC]"]
      }
    }
  ],
  defaultVariants: {
    withOverlay: true
  }
});
