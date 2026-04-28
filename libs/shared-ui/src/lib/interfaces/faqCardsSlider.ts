import type { IButtonProps } from "@shared-ui/interfaces/button";

export interface IFAQCardData {
  question: string;
  description: string;
  linkButton: IButtonProps & {
    href?: string;
    target?: "_blank" | "_self";
    label?: string;
    onClick?: () => void;
  };
}

export interface IFAQCardsSliderProps {
  title?: string;
  cards: IFAQCardData[];
  className?: {
    container?: string;
    title?: string;
  };
}