import { render } from "@testing-library/react";
import { CarouselTestimonial } from "@components/testimonialCarousel/carousel";

const CarouselMock: any = jest.fn(() => <div data-testid="carousel" />);

jest.mock("@sitio-publico/shared-ui", () => ({
  Carousel: (props: any) => CarouselMock(props)
}));

jest.mock("@components/testimonialCarousel/slide", () => ({
  Slide: () => <div data-testid="slide" />
}));

describe("CarouselTestimonial", () => {
  it("passes config to Carousel", () => {
    render(<CarouselTestimonial data={[{ id: 1 } as any]} />);

    expect(CarouselMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [{ id: 1 }],
        loop: false,
        slidesPerView: 1.15,
        navigation: expect.objectContaining({
          type: "arrows",
          hiddenArrowOnFirstAndLast: true
        })
      })
    );
  });

  it("passes compact config to Carousel when compact is true", () => {
    CarouselMock.mockClear();
    render(<CarouselTestimonial data={[{ id: 1 } as any]} compact={true} />);

    expect(CarouselMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [{ id: 1 }],
        loop: false,
        slidesPerView: 1,
        breakpoints: expect.objectContaining({
          480: expect.objectContaining({
            slidesPerView: 1.2
          })
        })
      })
    );
  });
});
