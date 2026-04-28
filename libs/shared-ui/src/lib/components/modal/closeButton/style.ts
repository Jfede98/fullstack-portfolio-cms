import { tv } from "tailwind-variants";

export const CloseButtonStyle = tv({
  base: [
    "absolute top-4 right-4 z-10",
    "p-2 rounded-full hover:bg-gray-100",
    "transition-colors duration-200",
    "text-gray-500 hover:text-gray-700",
    "cursor-pointer"
  ]
});
