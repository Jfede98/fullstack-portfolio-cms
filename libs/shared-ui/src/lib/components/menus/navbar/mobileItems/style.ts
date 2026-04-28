import { tv } from "tailwind-variants";

export const MobileListItemsStyle = tv({
  slots: {
    baseAccordion: ["gap-0!"],
    baseDropdown: ["hover:bg-primary-100", "p-0!", "group"],
    triggerDropdown: ["p-4", "group-hover:bg-primary-200"],
    titleSectionStyle: [
      "text-primary-900",
      "text-caption!",
      "cursor-pointer",
      "px-4"
    ],
    itemStyle: [
      "flex",
      "gap-2",
      "items-center",
      "hover:bg-primary-300",
      "px-8"
    ],
    linkStyle: ["py-4", "block", "w-full", "text-caption!"],
    linkItemWhitoutDropdown: [
      "py-4",
      "block",
      "w-full",
      "text-caption!",
      "hover:bg-primary-300",
      "px-8"
    ]
  }
});
