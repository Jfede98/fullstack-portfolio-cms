import { type FC, useId } from "react";
import { Icon } from "@shared-ui/components/icons";
import { Card } from "@shared-ui/components/cards/base";
import { TestimonialCardStyle } from "./style";
import { generateStarRating } from "@shared-ui/helpers/starRating";
import type { ITestimonialCardProps } from "@shared-ui/interfaces/cards/testimonialCard.ts";
import clsx from "clsx";

export const TestimonialCard: FC<ITestimonialCardProps> = ({
  rating,
  text,
  author,
  className,
  icon
}) => {
  const { container, stars, textStyle, authorStyle } = TestimonialCardStyle();
  const starArray = generateStarRating(rating);
  const uniqueId = useId();

  return (
    <Card
      className={{ base: clsx(container(), className?.container) }}
      dataTestid="testimonial-card"
    >
      <div
        className={clsx(stars(), className?.stars)}
        data-testid="testimonial-stars"
      >
        {starArray.map((star, index) => (
          <Icon
            key={`${uniqueId}-star-${star.type}-${index}`}
            name={star.type}
            type={icon?.type || "rounded"}
            size={icon?.size}
            color={icon?.color || "text-primary-100"}
            dataTestid={`star-${index}`}
          />
        ))}
      </div>
      <span
        className={clsx(textStyle(), className?.text)}
        data-testid="testimonial-text"
      >
        "{text}"
      </span>
      <span
        className={clsx(authorStyle(), className?.author)}
        data-testid="testimonial-author"
      >
        {author}
      </span>
    </Card>
  );
};
