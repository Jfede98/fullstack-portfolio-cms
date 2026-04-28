import { tv } from "tailwind-variants";

export const ModalStyle = tv({
  slots: {
    overlay: [
      "fixed",
      "inset-0",
      "z-50",
      "bg-black/60",
      "backdrop-blur-sm",
      "flex",
      "items-center",
      "justify-center",
      "p-4"
    ],
    content: [
      "relative",
      "w-full",
      "bg-white",
      "rounded-lg",
      "shadow-xl",
      "max-h-[90vh]",
      "overflow-y-auto",
      "border-4",
      "border-black/50"
    ],
    header: ["flex", "tems-center", "justify-between", "px-6", "py-4"],
    titleStyle: ["text-xl", "font-semiboldæ", "text-gray-900"],
    body: ["px-6 py-4"]
  },
  variants: {
    size: {
      sm: {
        content: "max-w-sm"
      },
      md: {
        content: "max-w-lg"
      },
      lg: {
        content: "max-w-2xl"
      },
      xl: {
        content: "max-w-4xl"
      },
      full: {
        content: "max-w-[95vw]"
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
});
