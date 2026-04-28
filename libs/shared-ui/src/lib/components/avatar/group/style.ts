import { tv } from "tailwind-variants";

export const AvatarGroupStyles = tv({
  slots: {
    base: ["flex", "items-center"],
    wrapper: []
  },
  variants: {
    size: {
      sm: {
        wrapper: ["[&:not(:first-child)]:-ml-6"]
      },
      md: {
        wrapper: ["[&:not(:first-child)]:-ml-8"]
      },
      lg: {
        wrapper: ["[&:not(:first-child)]:-ml-10"]
      },
      xl: {
        wrapper: ["[&:not(:first-child)]:-ml-12"]
      }
    },
    animation: {
      true: {
        wrapper: [
          "transition-transform",
          "duration-300",
          "ease-in-out",
          "hover:-translate-y-1"
        ]
      }
    }
  },
  defaultVariants: {
    size: "lg"
  }
});
