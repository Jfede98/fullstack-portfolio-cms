import { tv } from "tailwind-variants";

export const ItemsNavbarStyle = tv({
  slots: {
    base: ["hidden", "lg:flex", "items-center", "gap-2", "xl:", "h-full"],
    item: [
      "relative",
      "group",
      "flex",
      "items-center",
      "gap-1",
      "py-1",
      "px-3",
      "rounded-lg",
      "text-white/90",
      "hover:text-white",
      "hover:bg-primary-600",
      "transition-all",
      "duration-300",
      "ease-in-out"
    ],
    triggerLinkItem: ["flex", "items-center", "px-3", "py-1", "cursor-pointer"],
    tiggerLinkContent: ["flex", "items-center", "gap-1", "cursor-pointer"],
    triggerIcon: ["transition-transform", "duration-300", "group-hover:rotate-180"]
  }
});
