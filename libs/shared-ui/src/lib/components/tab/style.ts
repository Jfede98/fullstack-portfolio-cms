import { tv } from "tailwind-variants";

export const TabStyles = tv({
  slots: {
    base: ["flex", "w-full", "flex-col"],
    trigger: [
      "flex",
      "p-0.5",
      "md:p-0.75",
      "items-center",
      "w-full",
      "md:w-fit",
      "bg-gray-100",
      "rounded-lg",
      "mx-auto",
      "overflow-x-auto",
      "snap-x",
      "[&::-webkit-scrollbar]:hidden",
      "ms-overflow-style:none",
      "scrollbar-width:none"
    ],
    triggerLabel: ["block", "z-10", "font-normal"],
    triggerElementWrapper: [
      "flex-1",
      "min-w-[120px]",
      "md:min-w-max",
      "snap-center",
      "relative",
      "flex",
      "transition-all",
      "outline-none",
      "cursor-pointer",
      "rounded-md",
      "items-center",
      "justify-center",
      "gap-2",
      "md:px-6",
      "py-1",
      "font-normal"
    ],
    wrapperContent: ["relative", "py-6"],
    content: ["w-full"]
  },
  variants: {
    active: {
      true: {
        triggerElementWrapper: ["text-primary-900", "bg-white", "after:hidden", "font-medium"],
        triggerLabel: ["font-medium"]
      }
    },
    isLargeMenu: {
      true: {
        triggerElementWrapper: [
          "flex-col",
          "md:flex-row",
          "gap-1",
          "md:gap-2",
          "py-3"
        ]
      }
    },
    rounded: {
      true: {
        trigger: ["bg-transparent", "gap-1", "lg:gap-3"],
        triggerElementWrapper: [
          "rounded-full",
          "bg-gray-100",
          "after:hidden",
          "py-1.5",
          "px-3",
          "md:px-5",
          "h-8",
          "text-sm",
          "leading-tight"
        ],
        triggerLabel: ["whitespace-nowrap"]
      }
    },
    default: {
      true: {
        triggerElementWrapper: [
          "after:content-['']",
          "after:absolute",
          "after:right-0",
          "after:h-1/2",
          "after:w-[1px]",
          "after:bg-gray-400/50",
          "last:after:hidden"
        ]
      }
    }
  },
  compoundVariants: [
    {
      active: true,
      rounded: true,
      className: {
        triggerElementWrapper: ["bg-primary-500", "text-white", "font-medium"],
        triggerLabel: ["font-medium"]
      }
    }
  ],
  defaultVariants: {
    active: false,
    default: true
  }
});
