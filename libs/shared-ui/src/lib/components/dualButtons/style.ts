import { tv } from "tailwind-variants";

export const DualButtonsStyle = tv({
  slots: {
    wrapper: [
      "relative",
      "w-full",
      "min-h-[400px]",
      "flex",
      "items-center",
      "justify-center",
      "overflow-hidden"
    ],
    container: [
      "relative",
      "z-10",
      "w-full",
      "max-w-container",
      "mx-auto",
      "px-4",
      "md:px-8",
      "py-16",
      "md:py-20"
    ],
    overlay: [
      "absolute",
      "inset-0",
      "bg-primary-50/60",
      "z-0"
    ],
    content: [
      "flex",
      "flex-col",
      "items-center",
      "text-center",
      "gap-6",
      "md:gap-8"
    ],
    titleStyle: [
      "text-primary-700",
      "text-center",
      "max-w-4xl"
    ],
    descriptionStyle: [
      "text-primary-900",
      "text-center",
      "max-w-2xl",
      "leading-relaxed"
    ],
    buttonsContainer: [
      "flex",
      "flex-col",
      "sm:flex-row",
      "gap-4",
      "items-center",
      "justify-center",
      "w-full",
      "max-w-md"
    ]
  }
});