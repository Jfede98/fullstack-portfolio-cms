import { render } from "@testing-library/react";
import { Slide } from "@components/testimonialCarousel/slide";

const CardMock: any = jest.fn(() => <div data-testid="card" />);

jest.mock("@sitio-publico/shared-ui", () => ({
  TestimonialCard: (props: any) => CardMock(props)
}));

describe("TestimonialCarousel Slide", () => {
  it("passes props to TestimonialCard", () => {
    render(<Slide rating={4} text="Ok" author="Ana" />);
    expect(CardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        rating: 4,
        text: "Ok",
        author: "Ana"
      })
    );
  });
});
