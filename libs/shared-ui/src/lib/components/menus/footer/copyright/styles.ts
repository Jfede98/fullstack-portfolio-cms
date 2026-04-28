import { tv } from "tailwind-variants";

export const FooterCopyrightStyle = tv({
  slots: {
    container: ["flex", "gap-2", "items-center", "justify-center", "flex-wrap"],
    textStyle: ["text-primary-50!", "text-body", "inline-block", "text-center"],
    linkStyle: [
      "inline-block",
      "text-primary-300",
      "underline",
      "font-medium",
      "text-center"
    ]
  }
});
