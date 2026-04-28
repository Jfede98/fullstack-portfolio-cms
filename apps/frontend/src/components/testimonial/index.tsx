"use client";

import type { FC } from "react";
import type { ITestimonialSection } from "@interfaces/components/testimonial";
import { Button, TestimonialCard, Typography } from "@sitio-publico/shared-ui";

export const Testimonial: FC<ITestimonialSection> = ({
  title,
  description,
  testimonials,
  ctaButton
}) => {
  return (
    <section>
      {title?.text && (
        <Typography
          tag={title.tag}
          variant="h2"
          type="regular"
        >{title.text}</Typography>
      )}
      {description && <p>{description}</p>}
      {testimonials?.length && (
        <div>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`testimonial-${testimonial.id ?? "item"}-${index}`}
              rating={testimonial.rating ?? 0}
              text={testimonial.text ?? ""}
              author={testimonial.author ?? ""}
            />
          ))}
        </div>
      )}
      {ctaButton && <Button {...ctaButton} />}
    </section>
  );
};
