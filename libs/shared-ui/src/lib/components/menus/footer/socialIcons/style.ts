import { tv } from "tailwind-variants";

export const FooterSocialIconsStyle = tv({
  slots: {
    wrapperSocial: ["flex", "gap-3", "xl:mt-6"],
    iconSocialStyle: [
      "block",
      "object-contain",
      "w-9",
      "hover:opacity-80",
      "aspect-square",
      "max-w-[32px]",
      "cursor-pointer"
    ]
  }
});
