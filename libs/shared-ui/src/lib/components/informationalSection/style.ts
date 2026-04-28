import { tv } from "tailwind-variants";

export const InformationalSectionStyle = tv({
  slots: {
    wrapper: [
      "max-w-[1224px]",
      "justify-self-center",
      "flex",
      "flex-col-reverse",
      "md:flex-row",
      "items-stretch",
      "gap-8",
      "w-full",
      "py-8",
      "px-6",
      "md:px-18"
    ],
    textContainer: [
      "flex",
      "flex-col",
      "justify-center",
      "gap-8",
      "w-full",
      "md:w-1/2"
    ],
    imageContainer: ["w-full", "md:w-1/2", "flex"],
    imageStyle: ["w-full", "h-full", "object-cover", "block"],
    titleStyle: ["text-primary-900"],
    subtitleStyle: ["text-primary-900"],
    descriptionStyle: ["text-gray-400"]
  }
});