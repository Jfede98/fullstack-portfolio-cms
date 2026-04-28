import { tv } from "tailwind-variants";

export const AttentionCenterCardStyle = tv({
  slots: {
    card: [
      "flex",
      "flex-col",
      "bg-white",
      "rounded-lg",
      "shadow-md",
      "overflow-hidden",
      "h-full"
    ],
    imageWrapper: [
      "relative",
      "w-full",
      "h-48",
      "overflow-hidden"
    ],
    image: [
      "w-full",
      "h-full",
      "object-cover"
    ],
    content: [
      "flex",
      "flex-col",
      "p-4",
      "gap-3",
      "flex-1"
    ],
    title: [
      "text-lg",
      "font-bold",
      "text-[#1B263B]",
      "mb-2"
    ],
    infoContainer: [
      "flex",
      "flex-col",
      "gap-2",
      "mb-4"
    ],
    addressContainer: [
      "flex",
      "items-center",
      "gap-2"
    ],
    scheduleContainer: [
      "flex",
      "items-center", 
      "gap-2"
    ],
    infoText: [
      "text-sm",
      "text-gray-700",
      "flex-1"
    ],
    iconWrapper: [
      "flex-shrink-0"
    ],
    buttons: [
      "flex",
      "flex-col",
      "gap-2",
      "mt-auto"
    ],
    mapButton: [
      "w-full"
    ],
    servicesButton: [
      "w-full"
    ]
  }
});