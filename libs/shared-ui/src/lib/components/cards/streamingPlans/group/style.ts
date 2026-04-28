import { tv } from "tailwind-variants";

export const StreamingPlansGroupStyle = tv({
  slots: {
    wrapper: [
      "flex",
      "flex-col",
      "items-center",
      "gap-12",
      "px-4",
      "py-8",
      "w-full",
      "lg:px-[71px]"
    ],
    titleContainer: [
      "flex",
      "flex-col",
      "items-center",
      "gap-2",
      "text-center",
      "w-full",
      "lg:max-w-[1224px]"
    ],
    cardsContainer: [
      "flex",
      "flex-wrap",
      "justify-center",
      "w-full",
      "max-w-[1224px]",
      "gap-[30px]",
      "[&>*]:w-full",
      "[&>*]:max-w-[388px]",
      "[&>*]:flex-[1_1_280px]"
    ],
    carousel: [
      "w-full",
      "lg:max-w-[1224px]",
      "relative"
    ],
    carouselSlide: ["flex", "justify-center"]
  }
});
