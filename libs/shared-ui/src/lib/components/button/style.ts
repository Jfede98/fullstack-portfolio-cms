import { tv } from "tailwind-variants";

export const ButtonStyle = tv({
  base: [
    "p-3",
    "relative",
    "overflow-hidden",
    "cursor-pointer",
    "font-medium",
    "w-full",
    "text-[12px]",
    "leading-3",
    "sm:text-[14px]",
    "transition-all",
    "duration-300",
    "ease-in-out",
    "flex",
    "items-center",
    "justify-center",
    "gap-4",
    "hover:opacity-90",
    "hover:scale-[.992]",
    "hover:disabled:opacity-50",
    "disabled:opacity-50"
  ],
  variants: {
    typeStyle: {
      square: ["rounded-[8px]"],
      rounded: ["rounded-full"]
    },
    color: {
      primary: ["bg-primary-600", "text-primary-50"],
      secondary: ["bg-secondary", "text-primary-900"],
      tertiary: [
        "bg-tertiary",
        "text-white",
        "border-2",
        "border-tertiary-300"
      ],
      outline: [
        "bg-transparent",
        "text-primary-900",
        "border-2",
        "border-primary-900"
      ],
      noBorder: ["bg-transparent", "text-primary-500", ""],
      whatsapp: ["bg-green-500", "text-white", "hover:bg-green-600"]
    },
    size: {
      msm: ["text-sm", "max-w-msm"],
      sm: ["text-sm", "max-w-sm"],
      md: ["text-base", "max-w-md"],
      lg: ["text-lg", "max-w-lg"],
      xl: ["text-xl", "max-w-xl"],
      full: ["w-full"],
      fit: ["w-fit"]
    },
    disabled: {
      true: "opacity-70 pointer-events-none"
    },
    fontStyle: {
      normal: "font-medium",
      light: "font-light"
    }
  },
  compoundVariants: [
    {
      type: ["square"],
      color: ["outline"],
      disabled: true,
      class: "border-gray-500"
    }
  ],
  defaultVariants: {
    size: "full",
    color: "secondary",
    fontStyle: "normal"
  }
});
