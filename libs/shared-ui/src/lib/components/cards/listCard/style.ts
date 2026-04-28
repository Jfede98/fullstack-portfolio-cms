import { tv } from "tailwind-variants";

export const ListCardStyle = tv({
  slots: {
    container: [
      "flex",
      "flex-col",
      "gap-6",
      "p-6",
      "w-full",
      "sm:w-[474px]",
      "min-h-[290px]",
      "!border-2",
      "!border-[#E3CDF5]"
    ],
    title: [
      "font-medium",
      "text-title"
    ],
    list: [
      "flex",
      "flex-col",
      "gap-4",
      "list-none",
      "p-0",
      "m-0"
    ],
    listItem: [
      "flex",
      "items-start",
      "gap-3"
    ],
    iconWrapper: [
      "flex",
      "items-center",
      "justify-center",
      "w-6",
      "h-6",
      "rounded-full",
      "flex-shrink-0"
    ],
    itemText: [
      "font-normal",
      "text-body",
      "leading-6"
    ]
  }
});
