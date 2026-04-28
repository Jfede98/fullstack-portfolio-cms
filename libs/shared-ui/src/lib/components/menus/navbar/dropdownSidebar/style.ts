import { tv } from "tailwind-variants";

export const DropdownNavbarStyle = tv({
  slots: {
    base: [
      "text-primary-900",
      "text-caption!",
      "transition-all",
      "duration-300",
      "ease-in-out"
    ],
    divider: [
      "h-0.25",
      "bg-primary-200",
      "w-full",
      "max-w-[90%]",
      "mx-auto",
      "border-none",
      "mb-2"
    ],
    containerTopLink: ["flex", "flex-wrap", "gap-3", "p-4", "w-full"],
    topLink: [
      "w-full",
      "flex-1",
      "p-4",
      "flex",
      "items-center",
      "justify-center",
      "gap-3",
      "rounded-lg",
      "hover:text-white",
      "hover:bg-primary-700",
      "transition-all",
      "ease-in-out",
      "duration-300",
      "cursor-pointer",
      "first:bg-primary-800",
      "first:text-white"
    ],
    topLinkInsideContainer: ["flex", "items-center", "gap-2"]
  }
});
