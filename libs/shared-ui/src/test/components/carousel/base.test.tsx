import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Carousel } from "@shared-ui/components/carousel/base";

const mockSetIsHovered = vi.fn();
vi.mock("@shared-ui/hooks/useCarousel", () => ({
  useCarousel: () => ({
    containerRef: { current: null },
    isCentered: false,
    nextNavId: "next-test",
    prevNavId: "prev-test",
    activeIndex: 0,
    swiperRef: {
      current: {
        autoplay: {}
      }
    },
    handleBulletEnd: vi.fn(),
    isHovered: false,
    setIsHovered: mockSetIsHovered,
    isEnd: false,
    isBeginning: true
  })
}));

describe("Carousel base", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates hover state on mouse enter and leave", () => {
    const { container } = render(
      <Carousel
        Element={({ title }: { title: string }) => <div>{title}</div>}
        data={[{ title: "slide-1" }]}
        autoplay={{ delay: 1000 }}
      />
    );

    const swiperContainer = container.querySelector(".swiper");
    expect(swiperContainer).to.exist;

    fireEvent.mouseEnter(swiperContainer!);
    expect(mockSetIsHovered).toHaveBeenCalledWith(true);

    fireEvent.mouseLeave(swiperContainer!);
    expect(mockSetIsHovered).toHaveBeenCalledWith(false);
  });
});
