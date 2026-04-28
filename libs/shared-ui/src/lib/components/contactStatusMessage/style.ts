import { tv } from "tailwind-variants";

export const ContactStatusMessageStyle = tv({
  slots: {
    wrapper: [
      "flex",
      "flex-col",
      "items-center",
      "text-center",
      "gap-4",
      "py-6",
      "px-4"
    ],
    icon: [
      "flex",
      "h-12",
      "w-12",
      "items-center",
      "justify-center",
      "rounded-full"
    ],
    title: ["text-base", "font-medium", "text-primary-900"],
    description: ["text-sm", "text-gray-400"],
    button: ["w-full"]
  }
});
