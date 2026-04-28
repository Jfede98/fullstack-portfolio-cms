import { tv } from "tailwind-variants";

export const FooterRegulatoriosStyle = tv({
  slots: {
    base: [
      "text-white",
      "border",
      "rounded-full",
      "w-fit",
      "px-[16px]",
      "py-1",
      "flex",
      "gap-2",
      "items-center",
      "justify-center",
      "hover:opacity-80",
      "mx-auto",
      "mt-8",
      "xl:mt-0",
      "xl:mx-0",
      "xl:mr-auto"
    ],
    iconStyle: ["text-[18px]!"]
  }
});
