import { tv } from "tailwind-variants";

export const CardStyle = tv({
  base: [
    "flex",
    "flex-col",
    "rounded-2xl",
    "border"
  ],
  variants: {
    border: {
      white: ["border-white"],
      gray: ["border-gray-200", "shadow-[0px_3px_12px_0px_#415A7714]"]
    },
    backgroundColor: {
      none: ["bg-transparent"],
      white: ["bg-white"],
      gray: ["bg-[#F6F6F6]"]
    }
  },
  defaultVariants: {
    border: "gray",
    backgroundColor: "white"
  }
});
