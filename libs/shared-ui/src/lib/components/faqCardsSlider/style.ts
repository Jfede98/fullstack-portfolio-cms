import { tv } from "tailwind-variants";

export const FAQCardsSliderStyle = tv({
  slots: {
    container: [
      "w-full",
      "max-w-container",
      "mx-auto",
      "px-4"
    ],
    titleStyle: [
      "text-2xl",
      "lg:text-3xl",
      "font-bold",
      "text-primary-700",
      "text-left",
      "mb-8",
      "lg:mb-12"
    ],
    cardContent: [
      "p-6",
      "h-full",
      "flex",
      "flex-col",
      "gap-4"
    ],
    questionStyle: [
      "text-lg",
      "font-semibold",
      "text-primary-700",
      "mb-2"
    ],
    descriptionStyle: [
      "text-sm",
      "text-gray-600",
      "line-clamp-4",
      "flex-1",
      "mb-4"
    ],
    buttonContainer: [
      "mt-auto"
    ]
  }
});