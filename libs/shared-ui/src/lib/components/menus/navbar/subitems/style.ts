import { tv } from "tailwind-variants";

export const SubItemsStyle = tv({
  slots: {
    dropdown: [
      "absolute",
      "top-[calc(100%-4px)]",
      "left-1/2",
      "-translate-x-1/2",
      "min-w-[260px]",
      "bg-white",
      "rounded-2xl",
      "shadow-2xl",
      "border",
      "border-gray-100",
      "p-3",
      "z-50",
      "opacity-0",
      "invisible",
      "translate-y-4",
      "pointer-events-none",
      "transition-all",
      "duration-300",
      "ease-out"
    ],
    dropdownItem: [
      "flex",
      "items-center",
      "gap-3",
      "px-4",
      "py-2.5",
      "rounded-xl",
      "text-gray-700",
      "hover:bg-primary-50",
      "hover:text-primary-700",
      "transition-all"
    ]
  },
  variants: {
    isOpen: {
      true: {
        dropdown: [
          "opacity-100",
          "visible",
          "translate-y-1",
          "pointer-events-auto"
        ]
      },
      false: {
        dropdown: [
          "opacity-0",
          "invisible",
          "translate-y-4",
          "pointer-events-none"
        ]
      }
    }
  }
});
