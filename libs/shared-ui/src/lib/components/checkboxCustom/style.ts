import { tv } from "tailwind-variants";

export const CheckboxCustomStyle = tv({
  slots: {
    base: [
      "flex",
      "items-center",
      "gap-2",
      "w-full",
      "rounded-lg",
      "p-1",
      "cursor-pointer",
      "border",
      "border-transparent",
      "transition-all"
    ],
    checkboxWrapper: [
      "flex",
      "h-12",
      "w-12",
      "relative",
      "items-center",
      "justify-center",
      "p-[14px]",
      "shrink-0"
    ],
    checkbox: [
      "relative",
      "h-5",
      "w-5",
      "overflow-hidden",
      "appearance-none",
      "rounded-[4px]",
      "border",
      "border-gray-400",
      "bg-white",
      "transition-colors",
      "peer",
      "checked:border-primary-600",
      "checked:bg-primary-600",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-primary-200",
      "focus-visible:ring-offset-2"
    ],
    icon: [
      "pointer-events-none",
      "absolute",
      "left-1/2",
      "top-1/2",
      "h-[8px]",
      "w-[10px]",
      "-translate-x-1/2",
      "-translate-y-1/2",
      "opacity-0",
      "transition-opacity",
      "peer-checked:opacity-100"
    ],
    labelText: [
      "flex-1",
      "text-legal",
      "leading-4",
      "font-normal",
      "text-primary-900"
    ],
    link: [
      "text-primary-500",
      "underline",
      "underline-offset-2"
    ],
    errorMessage: [
      "text-[10px]",
      "text-red-600",
      "ml-12",
      "mt-1"
    ]
  },
  variants: {
    variant: {
      default: {
        base: ["bg-gray-50"]
      },
      transparent: {
        base: ["bg-transparent"]
      }
    },
    disabled: {
      true: {
        base: ["cursor-not-allowed", "opacity-60"],
        checkbox: ["cursor-not-allowed"],
        labelText: ["cursor-not-allowed"]
      }
    },
    hasError: {
      true: {
        base: ["border-red-500", "bg-red-50/50"],
        checkbox: ["border-red-600"],
        labelText: ["text-red-900"]
      }
    }
  },
  defaultVariants: {
    variant: "default"
  }
});
