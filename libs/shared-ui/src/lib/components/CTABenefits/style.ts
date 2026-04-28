import { tv } from "tailwind-variants";

export const BackgroundBenefitsStyle = tv({
  slots: {
    wrapper: [
      "transition-all",
      "duration-300",
      "ease-in-out",
      "max-w-container",
      "w-full",
      "xl:rounded-2xl",
      "justify-self-center",
      "overflow-hidden"
    ],
    base: [
      "flex",
      "flex-col",
      "items-center",
      "md:px-16",
      "px-4",
      "md:py-18",
      "py-14",
      "bg-primary-750-70",
      "w-full",
      "h-full"
    ],
    horizontalContainer: [
      "md:grid",
      "md:grid-cols-2",
      "md:gap-8",
      "md:items-center"
    ],
    contentSection: [
      "flex",
      "flex-col",
      "items-center",
      "text-center"
    ],
    buttonSection: [
      "py-4",
      "md:py-0"
    ],
    featuresContainer: [
      "pt-6",
      "w-full",
      "grid",
      "grid-cols-2",
      "gap-4",
      "md:flex",
      "md:flex-row",
      "md:justify-center",
      "md:items-center",
      "md:col-span-2"
    ],
    subtitleStyle: ["text-primary-100", "pt-2", "pb-6", "text-center"],
    titleStyle: ["text-white", "text-center"],
    featureItem: [
      "text-center",
      "p-2",
      "w-full",
      "col-span-1",
      "last:col-span-2",
      "md:col-auto",
      "md:max-w-[200px]"
    ],
    featureText: ["text-base", "text-white"]
  }
});
