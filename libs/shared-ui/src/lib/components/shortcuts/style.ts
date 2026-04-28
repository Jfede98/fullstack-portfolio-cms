import { tv } from "tailwind-variants";

export const shortcutStyle = tv({
  slots: {
    base: [
      "px-8",
      "py-4",
      "bg-white",
      "rounded-lg",
      "border",
      "border-gray-100",
      "shadow-[0px_3px_12px_0px_#5B166514]",
      "grid",
      "max-w-[656px]",
      "grid-cols-1",
      "md:grid-cols-2",
      "gap-0",
      "md:gap-x-8"
    ],
    itemContainer: [
      "py-5",
      "border-b",
      "border-gray-200",
      "last:border-b-0",
      "md:[&:nth-last-child(-n+2)]:border-b-0"
    ],
    link: [
      "flex",
      "items-center",
      "gap-4",
      "w-full",
      "font-medium",
      "transition-all",
      "duration-200",
      "hover:opacity-80"
    ],
    icon: [
      "w-6",
      "h-6",
      "flex-shrink-0",
      "flex",
      "items-center",
      "justify-center"
    ],
    text: ["flex-1", "text-primary", "text-base", "leading-6"],
    arrow: [
      "w-5",
      "h-5",
      "flex-shrink-0",
      "text-primary",
      "transition-transform",
      "duration-200",
      "group-hover:translate-x-1",
      "flex",
      "items-center",
      "justify-center"
    ]
  }
});
