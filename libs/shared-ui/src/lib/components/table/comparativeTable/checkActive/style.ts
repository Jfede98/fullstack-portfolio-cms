import { tv } from "tailwind-variants";

export const ComparativeTableCheckStyle = tv({
  slots: {
    iconColumn: []
  },
  variants: {
    active: {
      true: {
        iconColumn: ["text-primary-500"]
      },
      false: {
        iconColumn: ["text-gray-200"]
      }
    }
  }
});
