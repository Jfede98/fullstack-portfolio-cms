import type { IButtonProps } from "./button";
import type { ITypographyProps } from "./typography";

export interface IDualButtonsProps {
  id?: number;
  title?: ITypographyProps;
  description?: string;
  primaryButton?: IButtonProps;
  secondaryButton?: IButtonProps;
  backgroundImage?: string;
  enableOverlay?: boolean;
  className?: {
    wrapper?: string;
    container?: string;
    overlay?: string;
    content?: string;
    title?: string;
    description?: string;
    buttonsContainer?: string;
  };
}
