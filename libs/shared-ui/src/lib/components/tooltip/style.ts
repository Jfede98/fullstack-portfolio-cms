import { tv } from "tailwind-variants";

export const tooltipStyles = tv({
  base: [
    "absolute",
    "z-50",
    "overflow-hidden",
    "rounded-md",
    "px-3",
    "py-1.5",
    "text-xs",
    "shadow-md",
    "animate-in",
    "fade-in",
    "zoom-in-95",
    "duration-200",
    "bg-gray-900",
    "text-white",
    "dark:bg-gray-100",
    "dark:text-gray-900"
  ],
  variants: {
    side: {
      top: ["mb-1", "bottom-full", "left-1/2", "-translate-x-1/2"],
      bottom: ["mt-1", "top-full", "left-1/2", "-translate-x-1/2"],
      left: ["mr-1", "right-full", "top-1/2", "-translate-y-1/2"],
      right: ["ml-1", "left-full", "top-1/2", "-translate-y-1/2"]
    },
    size: {
      sm: ["w-max", "max-w-xs"],
      md: ["w-48"],
      lg: ["w-64"],
      xl: ["w-80"]
    }
  },
  defaultVariants: {
    side: "top"
  }
});
