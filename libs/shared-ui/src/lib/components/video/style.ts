import { tv } from "tailwind-variants";

export const VideoStyle = tv({
  slots: {
    wrapper: [
      "max-w-[514px]",
      "w-full",
      "h-[303px]",
      "rounded-2xl",
      "border",
      "border-2",
      "border-primary-50",
      "object-cover"
    ]
  }
});
