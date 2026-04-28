import { tv } from "tailwind-variants";

export const CentersFiltersStyle = tv({
  slots: {
    wrapper: [
      "w-full",
      "bg-white",
      "p-6",
      "rounded-lg",
      "shadow-sm",
      "mb-6"
    ],
    header: [
      "text-center",
      "mb-6"
    ],
    title: [
      "text-2xl",
      "md:text-3xl",
      "font-bold",
      "text-[#1B263B]",
      "mb-2"
    ],
    subtitle: [
      "text-gray-600",
      "text-base",
      "md:text-lg"
    ],
    searchSection: [
      "mb-6"
    ],
    searchLabel: [
      "text-lg",
      "font-semibold",
      "text-gray-800",
      "mb-4",
      "block"
    ],
    toggleButtons: [
      "flex",
      "gap-3",
      "justify-center",
      "flex-wrap"
    ],
    toggleButton: [
      "px-6",
      "py-3",
      "rounded-lg",
      "border-2",
      "font-medium",
      "transition-all",
      "duration-200",
      "cursor-pointer",
      "hover:shadow-md",
      "border-gray-300",
      "bg-white",
      "text-gray-700",
      "hover:border-[#1B263B]",
      "hover:text-[#1B263B]"
    ],
    activeToggle: [
      "border-[#1B263B]",
      "bg-[#1B263B]",
      "text-white",
      "hover:bg-[#0D1B2A]",
      "hover:border-[#0D1B2A]",
      "hover:text-white"
    ],
    filtersSection: [
      "flex",
      "gap-4",
      "justify-center",
      "flex-wrap"
    ],
    dropdownWrapper: [
      "min-w-[200px]",
      "flex-1",
      "max-w-[300px]"
    ]
  }
});