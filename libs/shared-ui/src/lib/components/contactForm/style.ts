import { tv } from "tailwind-variants";

export const ContactFormStyle = tv({
  slots: {
    form: ["flex", "flex-col", "gap-6", "w-full"],
    fieldsGrid: [
      "grid",
      "grid-cols-1",
      "md:grid-cols-2",
      "gap-4"
    ],
    fieldWrapper: ["flex", "flex-col", "gap-2"],
    fieldFull: ["md:col-span-2"],
    checkboxWrapper: ["mt-4"],
    buttonWrapper: ["mt-6", "flex", "justify-center"],
    button: ["w-full", "md:w-auto", "md:min-w-[200px]", "h-[44px]"]
  }
});
