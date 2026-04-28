import { tv } from "tailwind-variants";

export const StreamingPlanCardStyle = tv({
  slots: {
    card: [
      "w-full",
      "rounded-[12px]",
      "border-none",
      "bg-white",
      "shadow-[0px_0px_1px_rgba(40,41,61,0.04),0px_2px_4px_rgba(96,97,112,0.16)]",
      "overflow-hidden",
      "flex",
      "flex-col",
      "gap-4"
    ],
    imageWrapper: [
      "relative",
      "w-full",
      "h-[183px]",
      "p-2.5",
      "overflow-hidden"
    ],
    image: ["absolute", "inset-0", "w-full", "h-full", "object-cover"],
    imageOverlay: ["absolute", "inset-0", "bg-transparent"],
    imageGradient: [
      "absolute",
      "inset-x-0",
      "bottom-0",
      "h-16",
      "bg-gradient-to-t",
      "from-black/20",
      "to-transparent"
    ],
    badge: ["absolute", "top-4", "left-4"],
    content: ["flex", "flex-col", "items-center", "gap-4", "px-6", "pb-6"],
    buttons: ["flex", "flex-col", "items-center", "gap-2", "w-full"],
    primaryButton: ["rounded-[4px]", "text-sm", "leading-6"],
    secondaryButton: [
      "rounded-[4px]",
      "text-sm",
      "leading-6",
      "bg-white",
      "text-primary-500",
      "border",
      "border-white"
    ]
  }
});
