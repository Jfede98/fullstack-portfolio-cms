import { tv } from "tailwind-variants";

export const SessionButtonStyle = tv({
  slots: {
    base: [
      "w-full",
      "px-6",
      "lg:px-3",
      "lg:py-1",
      "lg:rounded-lg",
      "py-4",
      "mb-2",
      "mt-3",
      "lg:mb-0",
      "lg:mt-0",
      "flex",
      "gap-2",
      "items-center",
      "lg:hover:bg-primary-600",
      "lg:text-primary-50"
    ],
    text: ["block", "whitespace-nowrap"]
  }
});
