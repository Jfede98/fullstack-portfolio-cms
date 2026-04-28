import { tv } from "tailwind-variants";

export const ComparativeTableSectionStyles = tv({
  slots: {
    base: ["flex", "flex-col", "gap-2"],
    row: [
      "border-b",
      "border-gray-200",
      "flex",
      "items-center",
      "justify-between",
      "gap-2",
      "py-2",
      "w-full"
    ],
  }
});
