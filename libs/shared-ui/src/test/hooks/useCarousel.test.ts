import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useCarousel } from "../../lib/hooks/useCarousel";
import type { TCarouselBaseProps } from "@shared-ui/interfaces/carousel";

const mockSlideNext = vi.fn();
const mockDestroy = vi.fn();

let swiperCallbacks: any = {};
let mockSwiperInstance = null;

vi.mock("swiper", () => ({
  default: vi.fn().mockImplementation((_, options) => {
    swiperCallbacks = options?.on || {};

    mockSwiperInstance = {
      slideNext: mockSlideNext,
      destroy: mockDestroy,
      realIndex: 0,
      isEnd: false,
      isBeginning: true,
      params: {
        centeredSlides: options?.centeredSlides || false
      }
    };

    if (swiperCallbacks.init) {
      swiperCallbacks.init(mockSwiperInstance);
    }

    return mockSwiperInstance;
  })
}));

vi.mock("swiper/modules", () => ({
  Navigation: {},
  Autoplay: {}
}));

describe("useCarousel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSwiperInstance = null;
    swiperCallbacks = {};
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("debe inicializar con valores por defecto", () => {
    const props: TCarouselBaseProps = {};
    const { result } = renderHook(() => useCarousel(props));

    expect(result.current.activeIndex).toBe(0);
    expect(result.current.isBeginning).toBe(true);
    expect(result.current.isEnd).toBe(false);
    expect(result.current.isCentered).toBe(false);
    expect(result.current.isHovered).toBe(false);
    expect(result.current.containerRef.current).toBeNull();
  });

  it("debe inicializar isHovered según disabledAnimationSlide", () => {
    const props: TCarouselBaseProps = {
      disabledAnimationSlide: true
    };
    const { result } = renderHook(() => useCarousel(props));

    expect(result.current.isHovered).toBe(true);
  });

  it("debe generar IDs únicos para navegación", () => {
    const props: TCarouselBaseProps = {};
    const { result } = renderHook(() => useCarousel(props));

    expect(result.current.nextNavId).toMatch(/^next-/);
    expect(result.current.prevNavId).toMatch(/^prev-/);
    expect(result.current.nextNavId).not.toContain(":");
    expect(result.current.prevNavId).not.toContain(":");
  });

  it("handleBulletEnd NO debe llamar slideNext cuando está hovered", () => {
    const props: TCarouselBaseProps = {};
    const { result } = renderHook(() => useCarousel(props));

    act(() => {
      const mockContainer = document.createElement("div");
      result.current.containerRef.current = mockContainer;
    });

    act(() => {
      result.current.setIsHovered(true);
    });

    act(() => {
      result.current.handleBulletEnd();
    });

    expect(mockSlideNext).not.toHaveBeenCalled();
  });

  it("handleBulletEnd NO debe llamar slideNext cuando disabledAnimationSlide es true", () => {
    const props: TCarouselBaseProps = {
      disabledAnimationSlide: true
    };
    const { result } = renderHook(() => useCarousel(props));

    act(() => {
      const mockContainer = document.createElement("div");
      result.current.containerRef.current = mockContainer;
    });

    act(() => {
      result.current.handleBulletEnd();
    });

    expect(mockSlideNext).not.toHaveBeenCalled();
  });

  it("handleBulletEnd NO debe hacer nada si swiperRef es null", () => {
    const props: TCarouselBaseProps = {};
    const { result } = renderHook(() => useCarousel(props));

    act(() => {
      result.current.handleBulletEnd();
    });

    expect(mockSlideNext).not.toHaveBeenCalled();
  });

  it("handleBulletEnd NO debe llamar slideNext cuando autoplay está activo", () => {
    const props: TCarouselBaseProps = {
      autoplay: true
    };
    const { result } = renderHook(() => useCarousel(props));

    act(() => {
      const mockContainer = document.createElement("div");
      result.current.containerRef.current = mockContainer;
    });

    act(() => {
      result.current.handleBulletEnd();
    });

    expect(mockSlideNext).not.toHaveBeenCalled();
  });

  it("debe poder cambiar isHovered dinámicamente", () => {
    const props: TCarouselBaseProps = {};
    const { result } = renderHook(() => useCarousel(props));

    expect(result.current.isHovered).toBe(false);

    act(() => {
      result.current.setIsHovered(true);
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.setIsHovered(false);
    });

    expect(result.current.isHovered).toBe(false);
  });

  it("debe generar diferentes IDs en múltiples instancias", () => {
    const props: TCarouselBaseProps = {};
    const { result: result1 } = renderHook(() => useCarousel(props));
    const { result: result2 } = renderHook(() => useCarousel(props));

    expect(result1.current.nextNavId).not.toBe(result2.current.nextNavId);
    expect(result1.current.prevNavId).not.toBe(result2.current.prevNavId);
  });

  it("no debe inicializar Swiper si containerRef no tiene valor", () => {
    const props: TCarouselBaseProps = {};
    const { result } = renderHook(() => useCarousel(props));

    expect(result.current.swiperRef.current).toBeNull();
    expect(result.current.containerRef.current).toBeNull();
  });
});
