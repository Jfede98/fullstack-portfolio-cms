import { tv } from "tailwind-variants";

export const ArrowStyles = tv({
  slots: {
    base: [
      "relative",
      "overflow-hidden",
      "rounded-full",
      "bg-primary-800",
      "place-content-center",
      "cursor-pointer",
      "grid",
      "aspect-square",
      "hover:opacity-80",
      "hover:scale-[.990]"
    ],
    icon: [
      "border-t-2",
      "border-r-2",
      "border-white/90",
      "rounded-[20%]",
      "aspect-square"
    ]
  },
  variants: {
    direction: {
      left: {
        icon: ["-rotate-[135deg]"]
      },
      right: {
        icon: ["rotate-45"]
      }
    },
    size: {
      sm: { base: ["w-6.5"], icon: ["w-1.5"] },
      md: { base: ["w-7.5"], icon: ["w-2"] },
      lg: { base: ["w-8.5"], icon: ["w-2.5"] },
      xl: { base: ["w-10"], icon: ["w-3"] },
      "2xl": { base: ["w-12"], icon: ["w-3.5"] }
    },
    disabled: {
      true: {
        base: ["cursor-not-allowed", "pointer-events-none", "bg-primary-800/50"]
      }
    }
  },
  compoundVariants: [
    {
      direction: "left",
      size: "sm",
      className: {
        icon: ["ml-px"]
      }
    },
    {
      direction: "left",
      size: "md",
      className: {
        icon: ["ml-0.5"]
      }
    },
    {
      direction: "left",
      size: "lg",
      className: {
        icon: ["ml-0.75"]
      }
    },
    {
      direction: "left",
      size: "xl",
      className: {
        icon: ["ml-1"]
      }
    },
    {
      direction: "right",
      size: "sm",
      className: {
        icon: ["mr-px"]
      }
    },
    {
      direction: "right",
      size: "md",
      className: {
        icon: ["mr-0.5"]
      }
    },
    {
      direction: "right",
      size: "lg",
      className: {
        icon: ["mr-0.75"]
      }
    },
    {
      direction: "right",
      size: "xl",
      className: {
        icon: ["mr-1"]
      }
    },
    {
      direction: "left",
      size: "2xl",
      className: {
        icon: ["ml-1.25"]
      }
    },
    {
      direction: "right",
      size: "2xl",
      className: {
        icon: ["mr-1.25"]
      }
    }
  ],
  defaultVariants: {
    direction: "left",
    size: "md"
  }
});
