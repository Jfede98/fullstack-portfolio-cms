import { tv } from "tailwind-variants";

export const PlanCardStyle = tv({
  slots: {
    wrapper: [
      "h-full",
      "w-full",
      "min-w-0",
      "rounded-2xl",
      "border",
      "border-gray-100",
      "shadow-[0px_2px_16px_0px_#83378F1A]",
      "bg-gray-50",
      "overflow-visible"
    ],
    topContainer: [
      "p-4",
      "sm:p-6",
      "md:p-8",
      "flex",
      "flex-col",
      "bg-white",
      "w-full",
      "min-w-0",
      "rounded-t-2xl",
      "overflow-hidden"
    ],
    midContainer: [
      "px-4",
      "sm:px-6",
      "md:px-8",
      "py-4",
      "bg-white",
      "border-y",
      "border-gray-100",
      "min-w-0"
    ],
    speedContainer: [
      "flex",
      "flex-row",
      "flex-wrap",
      "text-ammount2",
      "md:text-ammount1",
      "break-words",
      "min-w-0"
    ],
    speedText: ["text-primary-500", "break-words"],
    planNameText: [
      "text-primary-900",
      "text-lg",
      "sm:text-xl",
      "md:text-[22px]",
      "pb-4",
      "break-words",
      "min-w-0"
    ],
    badge: [
      "gap-1",
      "flex",
      "flex-row",
      "flex-wrap",
      "bg-primary-50",
      "rounded-lg",
      "px-2",
      "py-1",
      "w-fit",
      "max-w-full",
      "items-center",
      "min-w-0"
    ],
    badgeText: [
      "text-primary-900",
      "font-bold",
      "text-xs",
      "sm:text-sm",
      "break-words",
      "min-w-0"
    ],
    amountContainer: [
      "flex",
      "flex-row",
      "flex-wrap",
      "pt-1",
      "items-end",
      "gap-1",
      "min-w-0"
    ],
    amountText: [
      "text-3xl",
      "sm:text-[36px]",
      "md:text-[40px]",
      "text-primary-900",
      "font-bold",
      "break-words",
      "min-w-0"
    ],
    amountImp: ["text-xs", "sm:text-sm", "text-gray-400", "break-words"],
    originalPrice: [
      "py-2",
      "text-gray-400",
      "text-sm",
      "sm:text-base",
      "line-through",
      "font-medium",
      "break-words",
      "min-w-0"
    ],
    legalDisclaimer: [
      "text-gray-400",
      "font-medium",
      "text-[10px]",
      "sm:text-xs",
      "break-words",
      "min-w-0"
    ],
    btnContainer: [
      "pt-6",
      "sm:pt-8",
      "md:pt-[42px]",
      "flex",
      "flex-col",
      "gap-2",
      "min-w-0"
    ],
    topBadge: [
      "absolute",
      "top-0",
      "left-1/2",
      "-translate-x-1/2",
      "-translate-y-1/2",
      "z-10",
      "uppercase",
      "font-bold",
      "text-[10px]",
      "sm:text-xs",
      "whitespace-nowrap",
      "px-3",
      "sm:px-4"
    ],
    dropdownContent: ["px-4", "pb-4", "pt-2"],
    dropdownContentMobile: ["mb-4", "md:hidden"],
    dropdownDetails: ["text-sm", "text-gray-300", "leading-6"],
    dropdownBase: [
      "rounded-b-2xl",
      "bg-gradient-to-b",
      "from-gray-50",
      "to-white",
      "py-2"
    ],
    dropdownTrigger: [
      "text-primary-500",
      "transition-all",
      "duration-300",
      "ease-out",
      "hover:bg-primary-50",
      "hover:text-primary-700",
      "hover:-translate-y-px",
      "w-fit!",
      "justify-self-center",
      "rounded-full",
      "px-4",
      "py-1"
    ],
    mobileAccordionCard: [
      "w-[312px]",
      "max-w-full",
      "rounded-[12px]",
      "border",
      "border-[#DBDBDC]",
      "bg-white"
    ],
    mobileAccordionTrigger: ["w-full", "p-4"],
    mobileAccordionHeader: [
      "flex",
      "items-center",
      "justify-between",
      "w-full"
    ],
    mobileAccordionSpeedRow: ["flex", "items-end", "gap-1"],
    mobileAccordionPlanName: [
      "pt-1",
      "text-[16px]",
      "leading-6",
      "font-normal",
      "text-[#2C2C30]"
    ],
    mobileAccordionPrice: [
      "text-[14px]",
      "font-medium",
      "leading-5",
      "text-[#2C2C30]"
    ],
    mobileAccordionContent: ["px-4", "pb-4", "space-y-4"],
    mobileAccordionBenefits: ["space-y-2"],
    mobileAccordionBenefitItem: ["flex", "items-center", "gap-2"],
    mobileAccordionBenefitText: ["text-sm", "leading-5", "text-gray-400"],
    mobileAccordionBtn: ["pt-1"],
    pricingWrapper: [
      "w-full",
      "rounded-2xl",
      "border",
      "border-gray-100",
      "bg-gray-50",
      "overflow-hidden"
    ],
    pricingTop: ["bg-white", "px-8", "py-8"],
    pricingSpeedRow: ["flex", "items-start", "gap-1", "leading-none"],
    pricingSpeedText: [
      "text-primary-500",
      "text-[52px]",
      "leading-[60px]",
      "font-normal"
    ],
    pricingPlanName: [
      "pt-1",
      "text-primary-900",
      "text-[22px]",
      "leading-7",
      "font-normal"
    ],
    pricingAmountRow: ["pt-6", "flex", "items-end", "gap-1"],
    pricingAmount: [
      "text-primary-900",
      "text-[40px]",
      "leading-[48px]",
      "font-medium"
    ],
    pricingAmountDecimal: [
      "text-primary-900",
      "text-[28px]",
      "leading-8",
      "font-bold"
    ],
    pricingTax: [
      "pb-1",
      "text-sm",
      "leading-5",
      "font-normal",
      "text-gray-400"
    ],
    pricingOriginal: [
      "pt-2",
      "text-xs",
      "leading-4",
      "font-medium",
      "line-through",
      "text-gray-400"
    ],
    pricingLegal: [
      "pt-2",
      "text-xs",
      "leading-4",
      "font-medium",
      "text-gray-400"
    ],
    pricingMiddle: ["bg-white", "border-y", "border-gray-100", "px-8", "py-4"],
    pricingBenefits: ["space-y-2"],
    pricingBenefitItem: ["flex", "items-center", "gap-2"],
    pricingBenefitText: [
      "text-sm",
      "leading-5",
      "font-normal",
      "text-gray-400"
    ],
    pricingIncludesLabel: [
      "pt-4",
      "text-xs",
      "leading-4",
      "font-medium",
      "text-gray-400"
    ],
    pricingIncludes: ["pt-1", "flex", "flex-wrap", "gap-4"],
    pricingAppItem: ["w-[73px]", "flex", "flex-col", "items-center", "gap-0.5"],
    pricingAppName: [
      "text-xs",
      "leading-4",
      "font-normal",
      "text-gray-400",
      "text-center"
    ],
    pricingAppDesc: [
      "text-[8px]",
      "leading-3",
      "font-bold",
      "text-gray-400",
      "text-center"
    ],
    pricingFooterBase: [
      "bg-gradient-to-b",
      "from-gray-50",
      "to-white",
      "rounded-none",
      "py-2"
    ],
    pricingFooterTrigger: [
      "text-primary-500",
      "text-sm",
      "leading-5",
      "transition-all",
      "duration-300",
      "ease-out",
      "hover:bg-primary-50",
      "hover:text-primary-700",
      "hover:-translate-y-px",
      "w-fit!",
      "justify-self-center",
      "rounded-full",
      "px-4",
      "py-1",
      "font-medium"
    ],
    pricingFooterContent: [
      "px-4",
      "pb-4",
      "pt-2",
      "text-sm",
      "text-gray-300",
      "leading-6"
    ]
  }
});
