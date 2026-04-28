import { tv } from "tailwind-variants";

export const AccordionStyle = tv({
  slots: {
    base: ["transition-all", "duration-300", "ease-in-out", "flex", "flex-col"],
    dropdown: ["py-2.25", "px-5.75"],
    dropdownTrigger: ["text-gray-500"],
    titleStyle: ["text-title", "leading-6"],
    descStyle: ["text-body", "leading-6"]
  },
  variants: {
    variant: {
      outline: {
        base: ["gap-4"],
        dropdown: [
          "rounded-[10px]",
          "border",
          "border-gray-200",
          "bg-white",
          "relative"
        ],
        dropdownTrigger: ["text-primary-900"],
        titleStyle: ["font-medium", "text-primary-900"],
        descStyle: ["text-gray-400"]
      },
      default: {
        base: ["gap-4"],
        dropdown: ["border-0", "relative"]
      }
    },
    active: {
      true: {
        dropdown: ["py-6.25", "px-5.75"]
      }
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export const ItemDescriptionStyle = tv({
  slots: {
    paragraph: ["text-body", "leading-6", "text-gray-400"]
  }
});
