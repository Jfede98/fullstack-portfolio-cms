import { tv } from "tailwind-variants";

export const WhatsAppStyle = tv({
  slots: {
    base: [
      "group",
      "rounded-full",
      "bg-white",
      "w-14",
      "h-14",
      "flex",
      "items-center",
      "justify-center",
      "border-2",
      "border-green-100",
      "text-green-900",
      "transition-all",
      "duration-500",
      "ease-out",

      "md:hover:w-fit",
      "md:hover:px-3",
      "md:hover:bg-tertiary",
      "md:hover:text-white",
      "md:hover:pl-6",
      "overflow-hidden"
    ],
    imgStyle: ["block", "object-contain", "w-full", "h-full", "p-2.5", "md:group-hover:p-3.5"],
    textStyle: [
      "max-w-0",
      "opacity-0",
      "translate-x-[-8px]",

      "md:group-hover:max-w-[160px]",
      "md:group-hover:opacity-100",
      "md:group-hover:translate-x-0",

      "font-semibold",
      "text-base",
      "whitespace-nowrap"
    ]
  }
});
