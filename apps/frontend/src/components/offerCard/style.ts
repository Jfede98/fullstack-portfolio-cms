import { tv } from "tailwind-variants";

export const OfferCardStyle = tv({
  slots: {
    base: [
      "flex",
      "flex-col",
      "gap-3",
      "p-4",
      "lg:w-full",
      "lg:items-stretch"
    ],
    titleStyle: [
      "block",
      "text-primary-500!",
      "text-body",
      "font-bold",
      "text-center",
      "w-full",
      "max-w-[256px]",
      "mx-auto",
      "my-1",
      "lg:my-0",
      "lg:max-w-max"
    ],
    containerCards: ["flex", "flex-col", "gap-3", "lg:flex-row"]
  }
});
