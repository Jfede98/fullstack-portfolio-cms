import { tv } from "tailwind-variants";

export const IconStyle = tv({
  base: ["font-icons", "fill-current"],
  variants: {
    type: {
      outlined: ["font-light"],
      rounded: ["font-normal"],
      filled: ["font-bold"]
    },
    size: {
      xs: ["text-[16px]"],
      msm: ["text-[24px]"],
      sm: ["text-[28px]"],
      md: ["text-[32px]"],
      lg: ["text-[36px]"],
      xl: ["text-[40px]"],
      xxl: ["text-[44px]"]
    },
  },
  defaultVariants: {
    type: "outlined",
    size: "sm"
  }
});
