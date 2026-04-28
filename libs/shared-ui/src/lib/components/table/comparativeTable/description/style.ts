import { tv } from "tailwind-variants";

export const CompartiveTableDescriptionStlye = tv({
  slots: {
    base: ["flex", "items-center", "gap-3", "justify-between", "w-fit"],
    rowLabel: ["font-regular", "text-primary-900!", "text-body"],
    iconTooltip: ["cursor-pointer", "text-primary-900"],
  }
});
