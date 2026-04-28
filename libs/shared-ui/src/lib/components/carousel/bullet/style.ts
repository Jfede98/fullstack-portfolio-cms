import { tv } from "tailwind-variants";

export const BulletStyles = tv({
  base: [
    "bg-primary-100",
    "w-2",
    "h-2",
    "rounded-full",
    "transition-[width]",
    "duration-300",
    "ease-in-out",
    "cursor-pointer"
  ],
  variants: {
    active: {
      true: ["w-6.25", "bg-primary"]
    },
    animation: {
      true: ["animate-bullet", "bg-primary-100"]
    }
  }
});
