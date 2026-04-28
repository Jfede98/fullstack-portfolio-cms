import { tv } from "tailwind-variants";

export const drawerStyles = tv({
  slots: {
    overlay: [
      "fixed",
      "inset-0",
      "z-30",
      "bg-black/60",
      "backdrop-blur-sm",
      "transition-opacity duration-300"
    ],
    content: [
      "fixed",
      "top-[96px]",
      "right-[2.5%]",
      "bottom-2",
      "z-40",
      "h-auto",
      "w-[75%]",
      "max-w-[400px]",
      "bg-primary-50",
      "rounded-2xl",
      "flex",
      "flex-col",
      "overflow-y-auto",
      "transition-transform",
      "duration-300",
      "ease-in-out"
    ]
  },
  variants: {
    isOpen: {
      true: {
        overlay: ["pointer-events-auto", "opacity-100"],
        content: ["translate-x-0"]
      },
      false: {
        overlay: "opacity-0 pointer-events-none",
        content: "translate-x-[120%]"
      }
    }
  }
});
