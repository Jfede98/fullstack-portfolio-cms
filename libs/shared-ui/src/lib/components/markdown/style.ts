import { tv } from "tailwind-variants";

export const MarkdownStyle = tv({
  slots: {
    container: [
      "text-body", 
      "leading-6", 
      "text-gray-400",
      // Estilos globales para elementos HTML
      "[&_p]:mb-2",
      "[&_p]:last:mb-0",
      "[&_p]:text-gray-400",
      "[&_p]:leading-6",
      "[&_strong]:font-semibold",
      "[&_strong]:text-gray-600",
      "[&_em]:italic",
      "[&_em]:text-gray-500",
      "[&_u]:underline",
      "[&_a]:text-primary-700",
      "[&_a]:underline",
      "[&_a]:hover:text-primary-800",
      "[&_a]:transition-colors",
      "[&_a]:cursor-pointer",
      "[&_ul]:list-disc",
      "[&_ul]:list-inside",
      "[&_ul]:space-y-1",
      "[&_ul]:my-2",
      "[&_li]:text-gray-400",
      "[&_li]:leading-6",
      "[&_br]:block",
      "[&_br]:content-['']" 
    ],
    paragraph: ["text-body", "leading-6", "text-gray-400"],
    list: ["list-inside", "space-y-1"],
    listItem: ["text-body", "leading-6", "text-gray-400"],
    link: [
      "text-primary-700", 
      "underline", 
      "hover:text-primary-800", 
      "transition-colors",
      "cursor-pointer"
    ],
    underline: ["underline"],
    strong: ["font-semibold", "text-gray-600"]
  }
});
