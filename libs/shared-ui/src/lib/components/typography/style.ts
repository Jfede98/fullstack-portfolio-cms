import { tv } from "tailwind-variants";

export const TypographyStyle = tv({
  base: ["text-body", "font-light"],
  variants: {
    variant: {
      hero: ["text-hero"],
      h1: ["text-h1"],
      h2: ["text-h2"],
      h3: ["text-h3"],
      title: ["text-title"],
      subtitle: ["text-subtitle"],
      body: ["text-body"],
      caption: ["text-caption"],
      legal: ["text-legal"],
      ammount1: ["text-ammount1"],
      ammount2: ["text-ammount2"],
      ammount3: ["text-ammount3"]
    },
    type: {
      light: ["font-light"],
      regular: ["font-normal"],
      bold: ["font-medium"]
    },
    small: {
      true: []
    },
    underline: {
      true: ["underline"]
    }
  },
  compoundVariants: [
    {
      variant: "hero",
      small: true,
      className: ["text-hero-sm"]
    },
    {
      variant: "legal",
      small: true,
      className: ["text-legal-sm"]
    }
  ],
  defaultVariants: {
    variant: "body",
    type: "light"
  }
});
