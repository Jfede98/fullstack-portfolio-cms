import { tv } from "tailwind-variants";

export const ProjectCardStyle = tv({
  slots: {
    container: [
      "flex",
      "flex-col",
      "gap-4",
      "rounded-xl",
      "overflow-hidden",
      "border",
      "border-gray-200",
      "bg-white",
      "transition-shadow",
      "duration-200",
      "hover:shadow-lg",
      "h-full"
    ],
    imagePlaceholder: [
      "w-full",
      "h-40",
      "flex",
      "items-center",
      "justify-center",
      "text-4xl",
      "select-none",
      "flex-shrink-0"
    ],
    image: [
      "w-full",
      "h-40",
      "object-cover",
      "flex-shrink-0"
    ],
    body: [
      "flex",
      "flex-col",
      "gap-3",
      "px-5",
      "pb-5",
      "flex-1"
    ],
    categoryBadge: [
      "w-fit",
      "text-[11px]",
      "font-semibold",
      "uppercase",
      "tracking-wide",
      "rounded-full",
      "px-3",
      "py-1"
    ],
    title: [
      "font-semibold",
      "text-[16px]",
      "leading-snug",
      "text-gray-900"
    ],
    description: [
      "text-[14px]",
      "text-gray-500",
      "leading-relaxed",
      "flex-1"
    ],
    techList: [
      "flex",
      "flex-wrap",
      "gap-2",
      "mt-auto",
      "pt-2"
    ],
    techTag: [
      "text-[11px]",
      "font-medium",
      "rounded-md",
      "px-2",
      "py-1"
    ],
    actions: [
      "flex",
      "gap-3",
      "mt-2"
    ],
    actionLink: [
      "flex",
      "items-center",
      "gap-1",
      "text-[13px]",
      "font-medium",
      "transition-colors",
      "duration-150"
    ]
  }
});

export const CATEGORY_STYLES: Record<string, { badge: string; placeholder: string }> = {
  frontend:     { badge: "bg-blue-100 text-blue-700",   placeholder: "bg-blue-50" },
  backend:      { badge: "bg-green-100 text-green-700", placeholder: "bg-green-50" },
  fullstack:    { badge: "bg-purple-100 text-purple-700", placeholder: "bg-purple-50" },
  professional: { badge: "bg-orange-100 text-orange-700", placeholder: "bg-orange-50" },
  academic:     { badge: "bg-yellow-100 text-yellow-700", placeholder: "bg-yellow-50" }
};

export const TECH_TAG_STYLES: Record<string, string> = {
  blue:   "bg-blue-100 text-blue-700",
  green:  "bg-green-100 text-green-700",
  orange: "bg-orange-100 text-orange-700",
  purple: "bg-purple-100 text-purple-700",
  pink:   "bg-pink-100 text-pink-700",
  gray:   "bg-gray-100 text-gray-700",
  red:    "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700"
};

export const CATEGORY_EMOJI: Record<string, string> = {
  frontend:     "🖥️",
  backend:      "⚙️",
  fullstack:    "🚀",
  professional: "💼",
  academic:     "🎓"
};

export const CATEGORY_LABEL: Record<string, { es: string; en: string }> = {
  frontend:     { es: "Frontend",     en: "Frontend" },
  backend:      { es: "Backend",      en: "Backend" },
  fullstack:    { es: "Fullstack",    en: "Fullstack" },
  professional: { es: "Profesional",  en: "Professional" },
  academic:     { es: "Académico",    en: "Academic" }
};
