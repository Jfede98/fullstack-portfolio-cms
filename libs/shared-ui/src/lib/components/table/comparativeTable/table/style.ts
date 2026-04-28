import { tv } from "tailwind-variants";

export const ComparativeTableDeskStyles = tv({
  slots: {
    base: ["w-full", "border-collapse"],
    thHeadTitle: ["text-primary"],
    thStyle: ["py-3", "px-2", "mr-auto", "text-left"],
    tdStyle: ["border-t border-gray-200", "py-3", "px-1"]
  }
});
