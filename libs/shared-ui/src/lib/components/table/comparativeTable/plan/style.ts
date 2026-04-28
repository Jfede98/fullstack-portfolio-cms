import { tv } from "tailwind-variants";

export const PlanComparativeStyles = tv({
  slots: {
    base: [
      "w-full",
      "max-w-[280px]",
      "mx-auto",
      "my-2",
      "lg:mr-auto",
      "lg:ml-0",
      "flex",
      "flex-col",
      "gap-2"
    ],
    buttonContainer: ["mr-auto", "w-full", "flex", "flex-col", "gap-2"],
    headerContainer: [
      "flex",
      "flex-col",
      "gap-1",
      "items-center",
      "justify-center"
    ],
    priceLabel: ["text-primary"],
    prevPriceLabel: ["line-through"],
    titleStyle: ["text-primary-900"]
  },
  variants: {
    isDesktop: {
      true: {
        headerContainer: ["items-start"],
        buttonContainer: ["max-w-[200px]"]
      },
      false: {
        headerContainer: ["items-center"]
      }
    }
  }
});
