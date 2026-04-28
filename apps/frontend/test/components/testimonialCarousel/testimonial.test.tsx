import { render, screen } from "@testing-library/react";
import { TestimonialCarousel } from "@components/testimonialCarousel";

jest.mock("@sitio-publico/shared-ui", () => ({
  Icon: () => <div data-testid="icon" />
}));

jest.mock("@components/testimonialCarousel/header", () => ({
  Header: () => <div data-testid="header" />
}));

jest.mock("@components/testimonialCarousel/carousel", () => ({
  CarouselTestimonial: () => <div data-testid="carousel" />
}));

describe("TestimonialCarousel", () => {
  it("renders header and carousel", () => {
    render(
      <TestimonialCarousel
        title={{ text: "Opiniones", tag: "h2" }}
        description="Clientes"
        testimonials={[]}
      />
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  it("renders with features", () => {
    render(
      <TestimonialCarousel
        title={{ text: "Opiniones", tag: "h2" }}
        description="Clientes"
        testimonials={[]}
        features={[
          { title: "Rapido", description: "Es rapido", icon: "speed" },
          { title: "Seguro", description: "Es seguro", icon: "shield" }
        ]}
      />
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
    expect(screen.getAllByTestId("icon")).toHaveLength(2);
    expect(screen.getByText("Rapido")).toBeInTheDocument();
    expect(screen.getByText("Es seguro")).toBeInTheDocument();
  });
});
