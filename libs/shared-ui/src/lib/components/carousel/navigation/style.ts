import { tv } from "tailwind-variants";

export const NavigationStyles = tv({
  slots: {
    base: [
      "bg-primary-900",
      "border-2",
      "border-primary-800",
      "rounded-[100px]",
      "p-3",
      "flex",
      "items-center",
      "justify-evenly",
      "gap-2",
      "w-fit",
      "relative"
    ],
    textStyle: ["block", "text-white", "mx-2", "block", "text-[12px]"]
  }
});
