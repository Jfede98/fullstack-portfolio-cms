import { tv } from "tailwind-variants";

export const NavbarTabStyle = tv({
  slots: {
    base: [
      "hidden",
      "w-full",
      "lg:block",
      "border-b-2",
      "border-primary-850/90",
      "bg-primary-950",
      "rounded-t-2xl",
      "overflow-hidden"
    ],
    containerList: ["flex", "items-center"],
    wrapperItem: [
      "flex",
      "items-center",
      "hover:bg-primary-900",
      "bg-primary-700",
      "gap-2",
      "py-3",
      "px-6",
      "text-primary-50!",
      "text-legal",
      "transition-all",
      "duration-300",
      "ease-in-out"
    ]
  }
});
