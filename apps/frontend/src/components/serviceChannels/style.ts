import { tv } from "tailwind-variants";

export const serviceChannelsStyle = tv({
  slots: {
    container: [
      "py-12",
      "flex",
      "flex-col",
      "items-center",
      "gap-12",
      "w-full",
      "max-w-7xl",
      "mx-auto",
      "px-4",
      "origin-center",
      "transition-transform"
    ],
    title: [
      "text-primary-500",
      "text-[40px]",
      "text-center"
    ],
    cardsContainer: [
      "flex",
      "flex-row",
      "justify-center",
      "gap-14",
      "mb-8",
      "w-full",
      "flex-wrap"
    ]
  }
});

