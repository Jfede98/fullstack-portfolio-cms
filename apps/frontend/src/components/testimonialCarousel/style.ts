import { tv } from "tailwind-variants";

export const planCarouselStyle = tv({
  slots: {
    section: [
      "w-full",
      "bg-primary-50/40",
      "py-8"
    ],
    wrapper: [
      "flex",
      "flex-col",
      "items-start",
      "justify-center",
      "gap-[30px]",
      "w-full",
      "max-w-[1366px]",
      "mx-auto",
      "px-4",
      "py-6",
      "md:px-[71px]",
      "md:py-8",
      "origin-center",
      "transition-transform",
    ],
    horizontalLayout: [
      "grid",
      "grid-cols-1",
      "lg:grid-cols-2",
      "gap-8",
      "lg:gap-12",
      "w-full",
      "lg:items-start"
    ],
    testimonialsSection: [
      "w-full",
      "flex",
      "flex-col",
      "gap-8"
    ],
    featuresSection: [
      "w-full",
      "grid",
      "grid-cols-1",
      "md:grid-cols-2",
      "gap-4",
      "lg:pl-8",
      "self-center"
    ],
    featureItem: [
      "flex",
      "flex-col",
      "items-center",
      "text-center",
      "gap-3",
      "p-4",
      "w-full"
    ],
    featureIcon: [
      "bg-primary-50",
      "rounded-lg",
      "w-12",
      "h-12",
      "flex",
      "items-center",
      "justify-center",
      "flex-shrink-0"
    ],
    featureContent: [
      "flex",
      "flex-col",
      "gap-2",
      "items-center",
      "text-center"
    ],
    featureTitle: [
      "text-primary-900",
      "font-bold",
      "text-lg"
    ],
    featureDescription: [
      "text-primary-900",
      "text-sm",
      "leading-relaxed"
    ]
  }
});
