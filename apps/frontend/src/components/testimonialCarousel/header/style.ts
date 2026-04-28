import { tv } from "tailwind-variants";

export const headerStyle = tv({
  slots: {
    topContainer: [
      "flex",
      "flex-col",
      "w-full",
      "max-w-[365px]",
      "gap-4",
      "mx-auto",
      "md:max-w-[10000px]",
      "md:flex-row",
      "md:items-center",
      "md:gap-6",
      "md:justify-between"
    ],
    textContainer: [
      "flex",
      "max-w-[365px]",
      "md:max-w-[461px]",
      "lg:max-w-[673px]",
      "flex-col",
      "items-center",
      "gap-4",
      "text-center",
      "w-full",
      "md:items-start",
      "md:text-left",
      "text-primary"
    ],
    buttonStyle: ["w-full", "md:w-fit!"]
  }
});
