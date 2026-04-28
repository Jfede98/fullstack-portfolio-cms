import { tv } from "tailwind-variants";

export const OfferCardStyle = tv({
  slots: {
    base: [
      "bg-white",
      "rounded-lg",
      "py-4",
      "px-5",
      "flex",
      "flex-col",
      "lg:flex-col",
      "gap-4",
      "w-full",
      "lg:rounded-0",
      "lg:gap-6"
    ],
    imgStyle: [
      "block",
      "w-full",
      "aspect-[16/9]",
      "object-cover",
      "rounded-md"
    ],
    containerInfo: [
      "flex",
      "flex-col",
      "gap-2",
      "flex-1",
      "text-gray-400",
      "text-center",
      "lg:text-center"
    ],
    priceStyle: [
      "block",
      "font-bold",
      "text-lg",
      "md:text-ammount3",
      "lg:mb-2"
    ],
    titleStyle: ["block", "font-medium", "text-[12px]", "md:text-legal"],
    descriptionStyle: ["block", "text-[12px]", "md:text-legal"],
    linkStyle: [
      "inline-flex",
      "items-center",
      "gap-1",
      "mt-2",
      "text-primary-800",
      "font-medium",
      "text-sm",
      "hover:text-primary-900",
      "transition-colors",
      "group"
    ],
    arrowIcon: [
      "transition-transform",
      "group-hover:translate-x-1"
    ]
  }
});
