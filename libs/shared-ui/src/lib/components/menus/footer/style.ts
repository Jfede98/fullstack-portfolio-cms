import { tv } from "tailwind-variants";

export const FooterStyle = tv({
  slots: {
    base: [
      "bg-primary-900",
      "py-12",
      "px-[16px]",
      "flex",
      "flex-col",
      "justify-center",
      "xl:py-16",
      "xl:px-17.75"
    ],
    wrapperLogo: [
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "gap-8",
      "xl:items-start",
      "xl:justify-start",
      "xl:mr-10",
      "xl:mr-20"
    ],
    wrapperSections: [
      "flex",
      "flex-col",
      "xl:flex-row",
      "gap-3",
      "w-full",
      "max-w-[1366px]",
      "mx-auto"
    ],
    wrapperColumnsAndRegulatorios: [
      "flex",
      "flex-col",
      "xl:flex-1",
      "xl:items-start"
    ],
    wrapperRegulatorios: [
      "w-full",
      "xl:flex",
      "xl:justify-center",
      "xl:mt-4"
    ],
    dividerStyle: ["w-full", "h-0.5", "bg-primary-700", "my-8", "border-none"],
    simpleBase: [
      "w-full",
      "bg-primary-600",
      "py-8",
    ],
    simpleContainer: [
      "mx-auto",
      "flex",
      "w-full",
      "max-w-[1280px]",
      "justify-center",
      "px-6",
      "md:px-10",
    ],
    noItemsBase: [
      "bg-primary-900",
      "flex",
      "flex-col",
      "justify-center",
      "py-2",
      "px-10",
      "xl:px-18",
      "xl:min-h-[82px]",
      "xl:h-full",
    ],
  }
});
