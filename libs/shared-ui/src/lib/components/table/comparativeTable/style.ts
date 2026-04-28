import { tv } from "tailwind-variants";

export const ComparativeTableStyle = tv({
  slots: {
    header: ["w-full", "mt-4", "mb-6", "mx-auto"],
    titleStyle: [
      "block",
      "text-center",
      "mb-2",
      "text-primary-900!",
      "whitespace-nowrap",
      "text-[clamp(1.25rem,5vw,2.25rem)]!",
      "leading-tight"
    ],
    subtitleStyle: ["block", "text-center!", "text-gray-400!"]
  }
});
