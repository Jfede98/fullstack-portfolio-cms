import { tv } from "tailwind-variants";

export const BadgeStyle = tv({
  base: [
    "w-fit",
    "font-medium",
    "text-[12px]",
    "rounded-lg",
    "px-2",
    "py-1",
    "flex",
    "gap-2"
  ],
  variants: {
    isFeatured: {
      true: ["rounded-full"]
    },
    color: {
      primary: ["bg-primary-500", "text-white"],
      secondary: ["bg-secondary", "text-primary-900"],
      purple: ["bg-purple-50", "text-purple-900"],
      orange: ["bg-orange-50", "text-orange-900"],
      green: ["bg-green-50", "text-green-900"],
      yellow: ["bg-yellow-50", "text-yellow-900"]
    }
  },
  defaultVariants: {
    isFeatured: false,
    color: "primary"
  }
});
