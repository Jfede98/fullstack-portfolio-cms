import type { IIconStyleProps } from "@shared-ui/interfaces/cards/cards.ts";

type ITestimonialCardClassName = {
  container?: string;
  stars?: string;
  text?: string;
  author?: string;
};

export interface ITestimonialCardProps {
  rating: number;
  text: string;
  author: string;
  icon?: IIconStyleProps;
  className?: ITestimonialCardClassName;
}