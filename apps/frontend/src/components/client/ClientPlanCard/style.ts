import { tv } from "tailwind-variants";

export const ClientPlanCardStyle = tv({
  base: [
    "w-full",
    "max-w-[496px]",
    "md:max-w-[348px]",
    "lg:max-w-[360px]",
  ],
  variants: {
    isRecommended: {
      true: ["order-first xl:order-0"]
    }
  }
});
