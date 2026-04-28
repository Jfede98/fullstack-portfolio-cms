import { tv } from "tailwind-variants";

export const TestimonialCardStyle = tv({
  slots: {
    container: [
      "px-6",
      "md:px-8",
      "py-8",
      "md:py-10",
      "gap-6",
      "w-full",
      "h-full",
      "flex",
      "flex-col"
    ],
    stars: ["flex", "gap-1"],
    textStyle: ["text-md", "text-gray-400", "text-justify", "flex-1"],
    authorStyle: ["text-primary-500", "font-bold", "text-lg"]
  }
});