import { tv } from "tailwind-variants";

export const DropdownStyle = tv({
  slots: {
    base: ["transition-all", "duration-300", "ease-in-out", "relative"],
    wrapperTrigger: [
      "flex",
      "gap-2",
      "items-center",
      "justify-between",
      "w-full",
      "cursor-pointer"
    ],
    wrapperIcon: ["transition", "duration-300", "ease-in-out"],
    wrapperContent: [
      "absolute",
      "top-full",
      "left-0",
      "right-0",
      "z-50",
      "mt-1",
      "opacity-0",
      "invisible",
      "transition-all",
      "duration-200",
      "ease-in-out",
      "transform",
      "translate-y-[-10px]"
    ],
    contentInner: ["min-h-0"]
  },
  variants: {
    active: {
      true: {
        wrapperIcon: ["rotate-180"],
        wrapperContent: [
          "opacity-100",
          "visible",
          "translate-y-0"
        ]
      }
    },
    contentPosition: {
      overlay: {},
      inline: {
        wrapperContent: [
          "static",
          "mt-0",
          "grid",
          "grid-rows-[0fr]",
          "opacity-0",
          "visible",
          "overflow-hidden",
          "transition-[grid-template-rows,opacity,margin]",
          "duration-300",
          "ease-out",
          "transform-none"
        ]
      }
    }
  },
  compoundVariants: [
    {
      active: true,
      contentPosition: "inline",
      class: {
        wrapperContent: ["mt-1", "grid-rows-[1fr]", "opacity-100"]
      }
    }
  ],
  defaultVariants: {
    contentPosition: "overlay"
  }
});
