import { renderHook } from "@testing-library/react";
import { useHeroSlide } from "@hooks/useHeroSlide";

describe("useHeroSlide", () => {
  it("returns safe defaults when background image is missing", () => {
    const { result } = renderHook(() =>
      useHeroSlide({
        backgroundImage: undefined,
        widget: "w",
        isDesktop: true
      } as any)
    );

    expect(result.current.imageSources).toBeUndefined();
    expect(result.current.shouldShowOverlay).toBe(true);
    expect(result.current.widgetComponent).toBe("w");
  });

  it("returns image sources and overlay flag", () => {
    const { result } = renderHook(() =>
      useHeroSlide({
        backgroundImage: {
          desktop: "desktop.jpg",
          mobile: "mobile.jpg",
          enableOverlayDesktop: true,
          enableOverlayMobile: false
        },
        widget: "w",
        isDesktop: true
      } as any)
    );

    expect(result.current.imageSources).toEqual({
      desktop: "desktop.jpg",
      mobile: "mobile.jpg"
    });
    expect(result.current.shouldShowOverlay).toBe(true);
    expect(result.current.widgetComponent).toBe("w");
  });

  it("builds image sources with desktop and mobile", () => {
    const { result } = renderHook(() =>
      useHeroSlide({
        backgroundImage: {
          desktop: "desktop.jpg",
          mobile: "mobile.jpg",
          enableOverlayDesktop: true,
          enableOverlayMobile: false
        },
        widget: null,
        isDesktop: false
      } as any)
    );

    expect(result.current.imageSources).toEqual({
      desktop: "desktop.jpg",
      mobile: "mobile.jpg"
    });
    expect(result.current.shouldShowOverlay).toBe(false);
  });

  it("updates memoized values when background image or widget changes", () => {
    const { result, rerender } = renderHook(
      ({ backgroundImage, widget, isDesktop }) =>
        useHeroSlide({ backgroundImage, widget, isDesktop } as any),
      {
        initialProps: {
          backgroundImage: {
            desktop: "desktop-a.jpg",
            mobile: "mobile-a.jpg",
            enableOverlayDesktop: true,
            enableOverlayMobile: false
          },
          widget: "widget-a",
          isDesktop: true
        }
      }
    );

    expect(result.current.imageSources).toEqual({
      desktop: "desktop-a.jpg",
      mobile: "mobile-a.jpg"
    });
    expect(result.current.shouldShowOverlay).toBe(true);
    expect(result.current.widgetComponent).toBe("widget-a");

    rerender({
      backgroundImage: {
        desktop: "desktop-b.jpg",
        mobile: "mobile-b.jpg",
        enableOverlayDesktop: true,
        enableOverlayMobile: false
      },
      widget: "widget-b",
      isDesktop: false
    });

    expect(result.current.imageSources).toEqual({
      desktop: "desktop-b.jpg",
      mobile: "mobile-b.jpg"
    });
    expect(result.current.shouldShowOverlay).toBe(false);
    expect(result.current.widgetComponent).toBe("widget-b");
  });
});
