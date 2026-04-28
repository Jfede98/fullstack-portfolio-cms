import { act, renderHook } from "@testing-library/react";
import { useHero } from "@hooks/useHero";

describe("useHero", () => {
  it("builds data and updates active avatar on init", () => {
    const slides = [
      { id: 1, content: { title: { text: "Uno", tag: "h1" } } },
      { id: 2, content: { title: { text: "Dos", tag: "h1" } } }
    ] as any;
    const avatars = [{ src: "a" }, { src: "b" }] as any;
    const labels = ["uno", "dos"];
    const widget = "widget";

    const { result } = renderHook(() =>
      useHero({ slides, avatars, labels, widget })
    );

    expect(result.current.data).toEqual([
      {
        id: 1,
        title: { text: "Uno", tag: "h1" },
        imageLoading: "eager",
        imageFetchPriority: "high"
      },
      {
        id: 2,
        title: { text: "Dos", tag: "h1" },
        imageLoading: "lazy",
        imageFetchPriority: "auto"
      }
    ]);

    const swiper = { realIndex: 1, slideToLoop: jest.fn() } as any;

    act(() => {
      result.current.handleInit(swiper);
    });

    expect(result.current.navigationLabel).toBe("dos");
    expect(result.current.avatarGroup?.[1]?.active).toBe(true);

    act(() => {
      (result.current.avatarGroup?.[0] as any)?.onClick?.();
    });

    expect(swiper.slideToLoop).toHaveBeenCalledWith(0);
  });

  it("updates state from handleSlideChange and supports missing avatars/labels", () => {
    const slides = [{ id: 1, content: { title: { text: "Uno", tag: "h1" } } }] as any;
    const widget = { id: "w" };
    const { result } = renderHook(() =>
      useHero({ slides, avatars: undefined, labels: undefined, widget } as any)
    );

    const swiper = { realIndex: 0, slideToLoop: jest.fn() } as any;

    act(() => {
      result.current.handleSlideChange(swiper);
    });

    expect(result.current.data[0]).toEqual(
      expect.objectContaining({
        imageLoading: "eager",
        imageFetchPriority: "high"
      })
    );
    expect(result.current.navigationLabel).toBeUndefined();
    expect(result.current.avatarGroup).toBeUndefined();
    expect(result.current.widgetComponent).toBe(widget);
  });
});
