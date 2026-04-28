import { tv } from "tailwind-variants";

export const BenefitsAndAppsCardStyle = tv({
  slots: {
    divider: ["my-4", "h-px", "bg-gray-100", "mx-auto", "md:hidden"],
    benefitsContainer: ["space-y-2", "pb-4"],
    benefitItem: ["flex", "min-w-0", "items-start", "gap-2"],
    benefitIconWrapper: ["shrink-0"],
    benefitText: [
      "min-w-0",
      "flex-1",
      "self-center",
      "text-xs",
      "sm:text-sm",
      "wrap-break-word",
      "text-gray-400"
    ],
    appsLabel: [
      "pb-1",
      "text-[10px]",
      "sm:text-xs",
      "font-medium",
      "text-gray-400"
    ],
    appsContainer: [
      "flex",
      "flex-row",
      "flex-wrap",
      "justify-center",
      "min-[240px]:justify-start",
      "gap-2",
      "sm:gap-3",
      "px-1",
      "sm:px-2",
      "py-1"
    ],
    appItem: [
      "flex",
      "flex-col",
      "items-center",
      "min-w-15",
      "max-w-20",
      "sm:max-w-22.5"
    ],
    appImage: ["h-6", "w-6", "sm:h-8", "sm:w-8"],
    appName: [
      "w-full",
      "pt-0.5",
      "text-center",
      "text-[10px]",
      "sm:text-xs",
      "wrap-break-word",
      "text-gray-400"
    ],
    appDescription: [
      "w-full",
      "text-center",
      "text-[8px]",
      "sm:text-[9px]",
      "wrap-break-word",
      "text-gray-400"
    ]
  }
});
