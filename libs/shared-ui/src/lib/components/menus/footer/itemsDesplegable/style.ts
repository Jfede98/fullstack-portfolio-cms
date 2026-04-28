import { tv } from "tailwind-variants";

export const FooterItemsDesplegableStyle = tv({
  slots: {
    accordionBase: ["mt-10", "xl:hidden"],
    dropdownBase: ["p-0!"],
    dropdownTrigger: ["text-primary-50"],
    dropdownTitle: ["text-title", "font-bold"],
    accordionLinkStyle: [
      "text-white",
      "hover:underline",
      "w-full",
      "block",
      "py-2"
    ]
  }
});
