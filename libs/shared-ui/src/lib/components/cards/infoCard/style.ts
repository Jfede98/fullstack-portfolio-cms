import { tv } from "tailwind-variants";

export const InfoCardStyle = tv({
  slots: {
    container: [
      "flex",
      "flex-col",
      "gap-3",
      "p-4",
      "rounded-lg",
      "w-[280px]",
      "h-[190px]",
      "sm:w-[332px]",
      "sm:h-[223px]",
      "sm:gap-4",
      "sm:p-6"
    ],
    image: [
      "w-10",
      "h-10",
      "sm:w-12",
      "sm:h-12",
      "object-contain"
    ],
    title: [
      "font-medium",
      "text-subtitle",
      "sm:text-title"
    ],
    description: [
      "font-normal",
      "text-caption",
      "sm:text-body"
    ]
  }
});
