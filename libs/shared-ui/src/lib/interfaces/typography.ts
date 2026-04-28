import type { TypographyStyle } from "@shared-ui/components/typography/style";
import type { VariantProps } from "tailwind-variants";

type VariantStyle = VariantProps<typeof TypographyStyle>;
type TypographyBaseVariants = Omit<VariantStyle, "variant" | "small">;
type Variants = VariantStyle["variant"];
type TVariantWithSmall = Extract<Variants, "hero" | "legal">;
type TVariantWithoutSmall = Exclude<Variants, TVariantWithSmall>;

type TVariantProps =
  | {
      variant: TVariantWithSmall;
      small?: boolean;
    }
  | {
      variant?: TVariantWithoutSmall;
      small?: never;
    };

export interface ITyphographyClassName {
  base?: string;
}

type Tag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "strong"
  | "b"
  | "em"
  | "sub"
  | "sup"
  | "pre";

export type ITypographyProps = TVariantProps &
  TypographyBaseVariants & {
    dataTestid?: string;
    className?: ITyphographyClassName;
    tag?: Tag;
    children?: React.ReactNode;
    text?: string
    preserveLineBreaks?: boolean;
    unstyled?: boolean;
  };

export interface ITextConfig {
  text: string;
  tag?: ITypographyProps["tag"];
}