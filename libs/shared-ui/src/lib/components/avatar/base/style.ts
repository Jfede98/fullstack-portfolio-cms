import { tv } from "tailwind-variants";

export const AvatarStyles = tv({
  base: ["rounded-full", "aspect-square", "object-cover", "block"],
  variants: {
    size: {
      sm: ["w-8"],
      md: ["w-10"],
      lg: ["w-12"],
      xl: ["w-16"]
    },
    border: {
      true: ["border-2", "border-gray-200"]
    }
  },
  defaultVariants: {
    size: "lg"
  }
});
