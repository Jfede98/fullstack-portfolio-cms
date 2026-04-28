import { tv } from "tailwind-variants";

export const MapComponentStyle = tv({
  slots: {
    wrapper: [
      "w-full",
      "h-full",
      "min-h-[375px]",
      "rounded-lg",
      "overflow-hidden",
      "relative"
    ],
    fallback: [
      "w-full",
      "h-full",
      "bg-gray-200",
      "flex",
      "items-center",
      "justify-center"
    ],
    fallbackText: ["text-gray-500", "text-sm"]
  }
});

