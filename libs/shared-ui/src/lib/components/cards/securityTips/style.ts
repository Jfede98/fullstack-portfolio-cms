import { tv } from "tailwind-variants";

export const SecurityTipsCardStyle = tv({
  slots: {
    container: [
      "items-center",
      "text-center",
      "gap-6",
      "px-10",
      "py-12",
      "max-w-[420px]"
    ],
    titleStyle: ["text-primary-700"],
    descriptionStyle: ["text-gray-400", "leading-6", "max-w-85"],
    linkStyle: [
      "flex",
      "items-center",
      "gap-1",
      "text-primary-700",
      "font-medium",
      "hover:text-primary-800",
      "transition-colors"
    ]
  }
});
