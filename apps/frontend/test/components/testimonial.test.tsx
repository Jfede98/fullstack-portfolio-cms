import { render, screen } from "@testing-library/react";
import { Testimonial } from "@components/testimonial/index";

const ButtonMock: any = jest.fn(() => <div data-testid="button" />);
const CardMock: any = jest.fn(() => <div data-testid="card" />);

jest.mock("@sitio-publico/shared-ui", () => ({
  Button: (props: any) => ButtonMock(props),
  TestimonialCard: (props: any) => CardMock(props),
  Typography: ({ text }: { text: string }) => <div>{text}</div>
}));

describe("Testimonial", () => {
  it("renders title, description, and testimonials", () => {
    render(
      <Testimonial
        title={{ text: "Opiniones", tag: "h2" }}
        description="Clientes"
        testimonials={[
          { id: 1, author: "Ana", text: "Ok", rating: 5 },
          { id: 2, author: "Luis", text: "Bien" }
        ]}
        ctaButton={{ label: "Ver mas" } as any}
      />
    );

    expect(screen.getAllByTestId("card")).toHaveLength(2);
    expect(ButtonMock).toHaveBeenCalled();
    expect(CardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        rating: 5,
        text: "Ok",
        author: "Ana"
      })
    );
    expect(CardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        rating: 0,
        text: "Bien",
        author: "Luis"
      })
    );
  });

  it("handles missing id, text, and author gracefully", () => {
    CardMock.mockClear();
    render(
      <Testimonial
        testimonials={[
          { rating: 5 } // Missing id, text, and author
        ]}
      />
    );
    expect(CardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        rating: 5,
        text: "",
        author: ""
      })
    );
  });

  it("renders only section when data is empty", () => {
    ButtonMock.mockClear();
    CardMock.mockClear();
    const { container } = render(<Testimonial />);

    expect(container.querySelector("h2")).toBeNull();
    expect(container.querySelector("p")).toBeNull();
    expect(CardMock).not.toHaveBeenCalled();
    expect(ButtonMock).not.toHaveBeenCalled();
  });

  it("renders button when ctaButton is provided without testimonials", () => {
    ButtonMock.mockClear();
    CardMock.mockClear();
    render(<Testimonial ctaButton={{ label: "Ver mas" } as any} />);

    expect(CardMock).not.toHaveBeenCalled();
    expect(ButtonMock).toHaveBeenCalled();
  });

  it("skips button when ctaButton is undefined", () => {
    ButtonMock.mockClear();
    render(<Testimonial title={{ text: "Opiniones", tag: "h2" }} testimonials={[]} />);
    expect(ButtonMock).not.toHaveBeenCalled();
  });

  it("does not render title when title text is empty", () => {
    const { container } = render(
      <Testimonial
        title={{ text: "", tag: "h2" }}
        description="solo descripcion"
        testimonials={undefined}
      />
    );

    expect(container.querySelector("h2")).toBeNull();
    expect(screen.getByText("solo descripcion")).toBeInTheDocument();
  });
});
