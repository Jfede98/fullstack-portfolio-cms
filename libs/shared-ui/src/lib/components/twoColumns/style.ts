import { tv } from "tailwind-variants";

export const TwoColumnsStyle = tv({
  slots: {
    base: ["w-full", "px-0", "py-4", "lg:py-0"],
    container: [
      "mx-auto",
      "flex",
      "w-full",
      "max-w-[313px]",
      "flex-col",
      "items-center",
      "gap-4",
      "lg:max-w-[1110px]",
      "lg:flex-row",
      "lg:items-center",
      "lg:justify-start",      "lg:gap-[62px]"
    ],
    left: ["w-full", "max-w-[313px]", "lg:basis-[543px]", "lg:max-w-[543px]", "lg:shrink-0"],
    right: ["w-full", "max-w-[313px]", "flex", "justify-center", "lg:basis-[506px]", "lg:max-w-[506px]", "lg:shrink-0", "lg:justify-start"],
    divider: ["h-px", "w-full", "lg:h-auto", "lg:w-px", "self-stretch", "shrink-0"]
  },
  variants: {
    background: {
      "primary-50": {
        base: ["bg-primary-50"]
      },
      white: {
        base: ["bg-white"]
      }
    },
    customWidths: {
      true: {
        container: ["lg:justify-center", "lg:gap-6"],
        left: ["lg:max-w-none"],
        right: ["lg:max-w-none"]
      }
    },
    showDivider: {
      true: {
        container: ["lg:gap-[62px]"]
      }
    }
  },
  compoundVariants: [
    {
      customWidths: true,
      showDivider: true,
      class: {
        container: ["lg:gap-0"],
        left: ["lg:pr-6"],
        right: ["lg:pl-6"]
      }
    }
  ],
  defaultVariants: {
    background: "primary-50",
    customWidths: false,
    showDivider: false
  }
});
