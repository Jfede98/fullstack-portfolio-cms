import { tv } from "tailwind-variants";

export const BenefitsStyle = tv({
  slots: {
    base: ["w-full", "flex", "flex-col"],
    titleStyle: ["text-primary-900"],
    benefitsContainerStyle: ["w-full", "flex"],
    benefitItemStyle: ["flex"],
    benefitContentStyle: ["flex", "flex-col"],
    benefitsTitleStyle: ["text-primary-900"],
    benefitsDescriptionStyle: ["text-primary-900"],
    benefitsIconContainer: [
      "bg-primary-50",
      "rounded-full",
      "items-center",
      "content-center"
    ]
  },
  variants: {
    layout: {
      horizontal: {
        base: ["py-10", "px-4", "md:px-18", "gap-8", "items-center"],
        titleStyle: ["text-center"],
        benefitsContainerStyle: [
          "flex-wrap",
          "gap-6",
          "justify-center",
          "items-start",
          "justify-items-center",
          "text-center",
          "items-start"
        ],
        benefitItemStyle: [
          "flex-col",
          "items-center",
          "gap-8",
          "py-6",
          "px-3",
          "w-full",
          "max-w-[287px]"
        ],
        benefitContentStyle: ["items-center", "gap-2"],
        benefitsTitleStyle: ["text-center"],
        benefitsDescriptionStyle: ["text-center", "text-2xs"],
        benefitsIconContainer: ["w-18", "h-18", "px-3", "pb-3", "pt-[0.4em]"]
      },
      vertical: {
        base: [
          "py-8",
          "px-6",
          "md:py-[22px]",
          "md:px-16",
          "gap-10",
          "items-start",
          "max-w-full",
          "mx-auto"
        ],
        titleStyle: ["w-full", "text-center"],
        benefitsContainerStyle: ["flex-col", "gap-4", "items-stretch"],
        benefitItemStyle: [
          "w-full",
          "items-center",
          "gap-6",
          "rounded-lg",
          "bg-white",
          "px-6",
          "py-4"
        ],
        benefitContentStyle: ["flex-1", "items-start", "gap-2", "min-w-0"],
        benefitsTitleStyle: ["text-left"],
        benefitsDescriptionStyle: ["text-left", "text-2xs"],
        benefitsIconContainer: ["size-16", "min-w-16", "flex", "justify-center"]
      }
    }
  },
  defaultVariants: {
    layout: "horizontal"
  }
});
