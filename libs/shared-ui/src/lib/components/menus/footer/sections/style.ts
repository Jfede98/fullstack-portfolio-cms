import { tv } from "tailwind-variants";

export const FooterSectionsStyle = tv({
  slots: {
    wrapperLinksServices: [
      "hidden",
      "xl:flex",
      "gap-3",
      "xl:justify-evenly",
      "xl:gap-10",
      "2xl:gap-14",
      "w-full",
      "max-w-[912px]"
    ],
    containerLinksServices: ["flex", "flex-col", "gap-4", "w-full", "xl:gap-6"],
    titleLinkService: ["text-primary-50!", "text-title", "font-medium"],
    linkStyle: ["text-body", "hover:underline"],
    wrapperLink: ["w-full", "text-white", "my-5"]
  }
});
