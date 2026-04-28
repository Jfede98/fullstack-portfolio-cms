import { tv } from "tailwind-variants";

export const StepperStyle = tv({
  slots: {
    base: ["flex", "w-full", "flex-col", "gap-6", "md:gap-8"],
    header: ["relative", "pt-0.5", "md:pt-2"],
    trail: [
      "pointer-events-none",
      "absolute",
      "left-3",
      "right-3",
      "top-3",
      "flex",
      "items-center",
      "md:left-[8%]",
      "md:right-[8%]",
      "md:top-[22px]"
    ],
    trailSegment: ["h-0", "flex-1", "border-t"],
    steps: [
      "relative",
      "z-10",
      "flex",
      "w-full",
      "items-start",
      "justify-between",
      "gap-4",
      "md:gap-10"
    ],
    stepItem: ["flex", "w-6", "flex-col", "items-center", "gap-3", "md:w-[90px]"],
    stepButton: [
      "flex",
      "h-6",
      "w-6",
      "items-center",
      "justify-center",
      "rounded-full",
      "border",
      "outline-none",
      "transition-colors"
    ],
    stepNumber: [
      "flex",
      "h-full",
      "w-full",
      "items-center",
      "justify-center",
      "text-center",
      "text-legal",
      "font-medium",
      "leading-4"
    ],
    stepLabel: [
      "hidden",
      "w-[90px]",
      "text-center",
      "text-caption",
      "font-normal",
      "leading-5",
      "md:block"
    ],
    content: ["w-full"],
    navigation: ["flex", "items-center", "justify-between", "gap-3"],
    backButton: ["w-fit", "p-0", "text-primary-500", "text-legal", "leading-4"],
    continueButton: ["w-fit", "px-4", "py-2"]
  },
  variants: {
    showMobileLabels: {
      true: {
        stepItem: ["w-6", "md:w-[90px]"],
        stepLabel: ["block"]
      }
    }
  },
  defaultVariants: {
    showMobileLabels: false
  }
});

export const StepperStateStyle = tv({
  slots: {
    stepButton: [],
    stepNumber: []
  },
  variants: {
    status: {
      active: {
        stepButton: ["border-0", "ring-4", "ring-white", "bg-primary-700"],
        stepNumber: ["text-white"]
      },
      completed: {
        stepButton: ["border-0", "ring-4", "ring-white", "bg-[#31A451]"],
        stepNumber: ["text-white"]
      },
      pending: {
        stepButton: ["border-0", "ring-1", "ring-gray-400", "bg-white"],
        stepNumber: ["text-gray-400"]
      }
    },
    clickable: {
      true: {
        stepButton: ["cursor-pointer"]
      },
      false: {
        stepButton: ["cursor-not-allowed"]
      }
    }
  },
  defaultVariants: {
    status: "pending",
    clickable: true
  }
});
