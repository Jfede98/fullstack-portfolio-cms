import { tv } from "tailwind-variants";

export const AttentionCardStyle = tv({
  slots: {
    container: [
      "px-4",
      "py-8",
      "gap-1",
      "text-center",
      "w-full",
      "h-full",
      "min-h-[188px]",
      "flex",
      "flex-col",
      "justify-between"
    ],
    titleStyle: [
      "text-[22px]",
      "text-gray-400",
      "break-words",
      "overflow-wrap-anywhere",
      "hyphens-auto"
    ],
    textStyle: [
      "text-gray-400",
      "font-bold",
      "text-lg",
      "hidden",
      "md:block",
      "break-words",
      "overflow-wrap-anywhere",
      "hyphens-auto"
    ],
    buttonWrapper: ["block", "md:hidden", "mt-auto"]
  }
});