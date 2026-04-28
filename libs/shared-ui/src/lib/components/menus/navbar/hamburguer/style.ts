import { tv } from "tailwind-variants";

export const HamburguerNavbarStyle = tv({
  slots: {
    base: [
      "relative",
      "flex",
      "items-center",
      "justify-center",
      "w-10",
      "h-10",
      "rounded-md",
      "transition-colors",
      "outline-none",
      "cursor-pointer",
      "lg:hidden"
    ],
    line: [
      "block",
      "absolute",
      "h-0.75",
      "w-6",
      "bg-primary-50",
      "rounded-full"
    ],
    wrapperLine: ["relative", "h-5", "w-6"]
  }
});
