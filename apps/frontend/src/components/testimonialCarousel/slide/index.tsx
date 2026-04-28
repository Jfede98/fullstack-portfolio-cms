import {
  TestimonialCard,
  type ITestimonialCardProps
} from "@sitio-publico/shared-ui";

export const Slide = ({ rating, text, author }: ITestimonialCardProps) => (
  <TestimonialCard rating={rating} text={text} author={author} />
);
