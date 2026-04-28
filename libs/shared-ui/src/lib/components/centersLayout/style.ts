import { tv } from "tailwind-variants";

export const CentersLayoutStyle = tv({
  slots: {
    wrapper: [
      "w-full"
    ],
    desktopLayout: [
      "hidden",
      "lg:flex",
      "gap-6",
      "min-h-[600px]"
    ],
    mapSection: [
      "flex-1",
      "min-h-[600px]",
      "rounded-lg",
      "overflow-hidden",
      "shadow-md"
    ],
    cardsSection: [
      "flex-1",
      "max-h-[600px]",
      "overflow-y-auto",
      "pr-2"
    ],
    mobileLayout: [
      "lg:hidden"
    ],
    mobileToggle: [
      "flex",
      "gap-2",
      "mb-4",
      "bg-gray-100",
      "p-1",
      "rounded-lg"
    ],
    mobileToggleButton: [
      "flex-1",
      "py-2",
      "px-4",
      "text-center",
      "rounded-md",
      "font-medium",
      "transition-all",
      "duration-200",
      "bg-transparent",
      "text-gray-600"
    ],
    activeMobileToggle: [
      "bg-white",
      "text-[#6E3279]",
      "shadow-sm"
    ],
    mobileContent: [
      "min-h-[500px]"
    ],
    cardsGrid: [
      "grid",
      "gap-4",
      "grid-cols-1",
      "sm:grid-cols-2",
      "lg:grid-cols-3"
    ],
    cardWrapper: [
      "h-full"
    ]
  }
});