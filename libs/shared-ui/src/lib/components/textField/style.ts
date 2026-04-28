import { tv } from "tailwind-variants";

export const TextFieldStyle = tv({
  slots: {
    base: [
      "w-full",
      "border",
      "border-gray-100",
      "rounded-lg",
      "px-3",
      "py-[16px]",
      "text-gray-500",
      "leading-6",
      "font-normal",
      "text-[16px]",
      "placeholder:text-gray-300",
      "placeholder:leading-6",
      "placeholder:font-normal",
      "placeholder:text-[16px]",
      "focus:outline-none"
    ],
    textarea: [
      "w-full",
      "border",
      "border-gray-100",
      "rounded-lg",
      "px-3",
      "py-[16px]",
      "text-gray-500",
      "leading-6",
      "font-normal",
      "text-[16px]",
      "placeholder:text-gray-300",
      "placeholder:leading-6",
      "placeholder:font-normal",
      "placeholder:text-[16px]",
      "focus:outline-none",
      "min-h-[120px]",
      "resize-vertical"
    ],
    inputWrapper: ["relative", "w-full"],
    iconStyle: [
      "absolute",
      "left-3",
      "top-1/2",
      "-translate-y-1/2",
      "text-gray-300",
      "pointer-events-none"
    ],
    arrowIconStyle: [
      "absolute",
      "right-3",
      "top-1/2",
      "-translate-y-1/2",
      "text-gray-400",
      "pointer-events-none"
    ],
    wrapperLabel: ["block"],
    labelStyle: [
      "text-[14px]",
      "leading-[20px]",
      "text-[#6E6E73]",
      "font-medium",
      "block",
      "mb-2"
    ],
    helperTextStyle: [
      "text-gray-300",
      "text-[12px]",
      "leading-[16px]",
      "font-normal",
      "block",
      "mt-2",
      "pl-1"
    ],
    dropdownWrapper: ["relative"],
    dropdown: [
      "absolute",
      "z-50",
      "w-full",
      "bg-white",
      "border",
      "border-gray-200",
      "rounded-lg",
      "shadow-lg",
      "max-h-80",
      "overflow-hidden"
    ],
    searchWrapper: ["p-2", "border-b", "border-gray-200"],
    searchInput: [
      "w-full",
      "px-3",
      "py-2",
      "border",
      "border-gray-200",
      "rounded-lg",
      "outline-none",
      "focus:border-primary-500",
      "text-[16px]"
    ],
    optionsContainer: ["max-h-60", "overflow-y-auto"],
    option: [
      "w-full",
      "text-left",
      "px-4",
      "py-2.5",
      "text-[16px]",
      "transition-colors",
      "hover:bg-primary-50",
      "hover:text-primary-700",
      "cursor-pointer"
    ],
    optionActive: [
      "bg-primary-100",
      "text-primary-700",
      "font-medium"
    ],
    optionDisabled: [
      "opacity-50",
      "cursor-not-allowed",
      "hover:bg-transparent",
      "hover:text-gray-700"
    ],
    emptyState: [
      "px-4",
      "py-8",
      "text-center",
      "text-gray-400",
      "text-[14px]"
    ]
  },
  variants: {
    hiddenLabel: {
      true: {
        wrapperLabel: ["sr-only"]
      }
    },
    hasError: {
      true: {
        base: ["border-red-500"],
        textarea: ["border-red-500"],
        helperTextStyle: ["text-red-400"]
      }
    },
    disabled: {
      true: {
        base: ["bg-gray-100", "text-gray-300", "cursor-not-allowed"],
        textarea: ["bg-gray-100", "text-gray-300", "cursor-not-allowed"]
      }
    },
    hasIcon: {
      true: {
        base: ["pl-12"]
      }
    },
    combobox: {
      true: {
        base: [
          "cursor-pointer",
          "pr-12",
          "appearance-none",
          "select-none",
          "caret-transparent"
        ]
      }
    }
  }
});
