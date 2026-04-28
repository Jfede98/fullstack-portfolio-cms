import { render } from "@testing-library/react";
import { Hero } from "@components/hero";

const CarouselMock: any = jest.fn(() => <div data-testid="carousel" />);

const useHeroMock = jest.fn();
const useHeroFeatureWrapMock = jest.fn();
const useMatchMediaMock = jest.fn();

jest.mock("@hooks/useHero", () => ({
  useHero: (args: any) => useHeroMock(args)
}));

jest.mock("@hooks/useHeroFeatureWrap", () => ({
  useHeroFeatureWrap: (...args: any[]) => useHeroFeatureWrapMock(...args)
}));

jest.mock("@sitio-publico/shared-ui", () => ({
  Carousel: (props: any) => CarouselMock(props),
  Constants: {
    Screen: { lg: 1024 }
  },
  useMatchMedia: () => useMatchMediaMock()
}));

jest.mock("@context/heroConfig", () => ({
  Provider: ({ children }: any) => children
}));

jest.mock("@components/hero/slide", () => ({
  Slide: () => <div data-testid="slide" />
}));

describe("Hero", () => {
  const createHeroHookState = (overrides: Record<string, unknown> = {}) => ({
    data: [{ id: 1, title: { text: "t" } }],
    handleSlideChange: jest.fn(),
    handleInit: jest.fn(),
    navigationLabel: "Label A",
    avatarGroup: [{ src: "avatar-a.png", active: true }],
    widgetComponent: null,
    ...overrides
  });

  const renderHero = (props: Record<string, unknown> = {}) =>
    render(
      <Hero
        slides={[{ id: 1 } as any]}
        avatars={[]}
        labels={[]}
        widget={null}
        {...props}
      />
    );

  const getCarouselProps = () => CarouselMock.mock.calls[0][0];

  beforeEach(() => {
    CarouselMock.mockClear();
    useHeroMock.mockClear();
    useHeroFeatureWrapMock.mockClear();
    useMatchMediaMock.mockClear();
    useMatchMediaMock.mockReturnValue({ isDesktop: false });
    useHeroFeatureWrapMock.mockReturnValue({
      wrapped: false,
      updateWrap: jest.fn()
    });
  });

  it("returns null when there are no slides", () => {
    const { container } = render(
      <Hero slides={[]} avatars={[]} labels={[]} widget={null} />
    );
    expect(container.firstChild).toBeNull();
    expect(useHeroMock).not.toHaveBeenCalled();
    expect(CarouselMock).not.toHaveBeenCalled();
  });

  it("calls hooks and renders carousel with base configuration", () => {
    const hookState = createHeroHookState();
    useHeroMock.mockReturnValue(hookState);

    renderHero();

    expect(useHeroMock).toHaveBeenCalledWith({
      slides: [{ id: 1 }],
      avatars: [],
      labels: [],
      widget: null
    });
    expect(useHeroFeatureWrapMock).toHaveBeenCalledWith(
      expect.objectContaining({ current: expect.any(HTMLElement) }),
      true
    );
    expect(CarouselMock).toHaveBeenCalled();

    const carouselProps = getCarouselProps();
    expect(carouselProps.loop).toBe(true);
    expect(carouselProps.Element).toBeDefined();
    expect(carouselProps.data).toEqual(hookState.data);
    expect(carouselProps.disabledAnimationSlide).toBe(false);
    expect(carouselProps.pagination).toBeUndefined();
    expect(carouselProps.className).toEqual(
      expect.objectContaining({
        pagination: expect.any(String),
        slide: expect.any(String)
      })
    );
  });

  it("builds avatars navigation when there are multiple slides and horizontalFormOnDesktop is false", () => {
    useHeroMock.mockReturnValue(createHeroHookState());

    renderHero({
      slides: [{ id: 1 } as any, { id: 2 } as any],
      labels: ["L1", "L2"]
    });

    const carouselProps = getCarouselProps();
    expect(carouselProps.navigation).toEqual({
      type: "avatars",
      text: "Label A",
      className: { base: expect.any(String) },
      avatarGroup: {
        size: "sm",
        border: true,
        animation: true,
        avatars: [{ src: "avatar-a.png", active: true }]
      }
    });
  });

  it("uses empty avatars array when hook returns avatarGroup as undefined", () => {
    useHeroMock.mockReturnValue(
      createHeroHookState({
        avatarGroup: undefined
      })
    );

    renderHero({
      slides: [{ id: 1 } as any, { id: 2 } as any]
    });

    const carouselProps = getCarouselProps();
    expect(carouselProps.navigation?.avatarGroup?.avatars).toEqual([]);
  });

  it("shows pagination when there are multiple slides", () => {
    useHeroMock.mockReturnValue(createHeroHookState());

    renderHero({
      slides: [{ id: 1 } as any, { id: 2 } as any]
    });

    const carouselProps = getCarouselProps();
    expect(carouselProps.pagination).toEqual({ duration: 5000 });
  });

  it("omits navigation when there is only one slide", () => {
    useHeroMock.mockReturnValue(createHeroHookState());

    renderHero({
      slides: [{ id: 1 } as any]
    });

    const carouselProps = getCarouselProps();
    expect(carouselProps.navigation).toBeUndefined();
  });

  it("omits navigation when horizontalFormOnDesktop is true", () => {
    useMatchMediaMock.mockReturnValue({ isDesktop: true });
    useHeroMock.mockReturnValue(
      createHeroHookState({
        widgetComponent: <div data-testid="hero-widget" />
      })
    );

    renderHero({
      slides: [{ id: 1 } as any, { id: 2 } as any],
      horizontalFormOnDesktop: true
    });

    expect(CarouselMock).toHaveBeenCalled();
    const carouselProps = getCarouselProps();
    expect(carouselProps.navigation).toBeUndefined();
  });

  it("renders widgetComponent when it exists", () => {
    useHeroMock.mockReturnValue(
      createHeroHookState({
        widgetComponent: <div data-testid="hero-widget" />
      })
    );

    const { getByTestId } = renderHero();

    expect(getByTestId("hero-widget")).toBeInTheDocument();
  });

  it("wires carousel init/slideChange handlers to hook handlers and updateWrap", () => {
    const handleInit = jest.fn();
    const handleSlideChange = jest.fn();
    const updateWrap = jest.fn();
    const swiperMock = { realIndex: 0 } as any;

    useHeroFeatureWrapMock.mockReturnValue({
      wrapped: false,
      updateWrap
    });
    useHeroMock.mockReturnValue(
      createHeroHookState({
        handleInit,
        handleSlideChange
      })
    );

    renderHero();

    const carouselProps = getCarouselProps();
    carouselProps.on.init(swiperMock);
    carouselProps.on.slideChange(swiperMock);

    expect(handleInit).toHaveBeenCalledWith(swiperMock);
    expect(handleSlideChange).toHaveBeenCalledWith(swiperMock);
    expect(updateWrap).toHaveBeenCalledTimes(2);
  });

  it("disables wrap detection in desktop mode", () => {
    useMatchMediaMock.mockReturnValue({ isDesktop: true });
    useHeroMock.mockReturnValue(createHeroHookState());

    renderHero();

    expect(useHeroFeatureWrapMock).toHaveBeenCalledWith(
      expect.objectContaining({ current: expect.any(HTMLElement) }),
      false
    );
  });

  it("maps slide delay from hero props", () => {
    useHeroMock.mockReturnValue(createHeroHookState());

    renderHero({
      slides: [{ id: 1 } as any, { id: 2 } as any],
      autoSlideDelayMs: 1000
    });

    const carouselProps = getCarouselProps();
    expect(carouselProps.pagination).toEqual({ duration: 1000 });
    expect(carouselProps.disabledAnimationSlide).toBe(false);
  });
});
