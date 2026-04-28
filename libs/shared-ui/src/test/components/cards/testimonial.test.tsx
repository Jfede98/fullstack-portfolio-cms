import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestimonialCard } from "@shared-ui/components/cards/testimonial";
import type { ITestimonialCardProps } from "@shared-ui/interfaces/cards/testimonialCard.ts";

const props: ITestimonialCardProps = {
  rating: 4,
  text: "Excelente servicio",
  author: "Juan Pérez",
  icon: { type: "rounded", color: "text-primary-500", size: "md" },
  className: {
    container: "custom-container",
    stars: "custom-stars",
    text: "custom-text",
    author: "custom-author"
  }
};

describe("TestimonialCard component", () => {
  it("renders the card container with custom class", () => {
    render(<TestimonialCard {...props} />);
    const card = screen.getByTestId("testimonial-card");
    expect(card).to.exist;
    expect(card.className).to.include("custom-container");
  });

  it("renders the correct number of stars", () => {
    render(<TestimonialCard {...props} />);
    const starsContainer = screen.getByTestId("testimonial-stars");
    expect(starsContainer).to.exist;
    const stars = Array.from(
      starsContainer.querySelectorAll('[data-testid^="star-"]')
    );
    expect(stars.length).to.equal(props.rating);
  });

  it("renders the text correctly with custom class", () => {
    render(<TestimonialCard {...props} />);
    const text = screen.getByTestId("testimonial-text");
    expect(text).to.exist;
    expect(text.textContent).to.equal(`"${props.text}"`);
    expect(text.className).to.include("custom-text");
  });

  it("renders the author correctly with custom class", () => {
    render(<TestimonialCard {...props} />);
    const author = screen.getByTestId("testimonial-author");
    expect(author).to.exist;
    expect(author.textContent).to.equal(props.author);
    expect(author.className).to.include("custom-author");
  });
});
