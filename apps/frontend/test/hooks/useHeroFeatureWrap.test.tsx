import { act, renderHook } from "@testing-library/react";
import { useHeroFeatureWrap } from "@hooks/useHeroFeatureWrap";

const createFeatureGrid = () => {
  const container = document.createElement("div");
  const grid = document.createElement("div");
  grid.setAttribute("data-hero-features", "true");

  const first = document.createElement("div");
  const second = document.createElement("div");

  Object.defineProperty(first, "offsetTop", { value: 0, configurable: true });
  Object.defineProperty(second, "offsetTop", { value: 10, configurable: true });

  grid.appendChild(first);
  grid.appendChild(second);
  container.appendChild(grid);

  return { container, grid, first, second };
};

describe("useHeroFeatureWrap", () => {
  const observe = jest.fn();
  const disconnect = jest.fn();
  let resizeCb: ResizeObserverCallback | undefined;

  beforeEach(() => {
    observe.mockReset();
    disconnect.mockReset();
    resizeCb = undefined;

    global.requestAnimationFrame = (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    };

    global.ResizeObserver = class {
      constructor(cb: ResizeObserverCallback) {
        resizeCb = cb;
      }
      observe = observe;
      disconnect = disconnect;
      unobserve = jest.fn();
    } as unknown as typeof ResizeObserver;
  });

  it("sets wrapped to true when items wrap", () => {
    const { container } = createFeatureGrid();
    const ref = { current: container };

    const { result } = renderHook(() => useHeroFeatureWrap(ref, true));

    act(() => {
      result.current.updateWrap();
    });

    expect(result.current.wrapped).toBe(true);
  });

  it("keeps wrapped false when items do not wrap", () => {
    const container = document.createElement("div");
    const grid = document.createElement("div");
    grid.setAttribute("data-hero-features", "true");
    const first = document.createElement("div");
    const second = document.createElement("div");
    Object.defineProperty(first, "offsetTop", { value: 0, configurable: true });
    Object.defineProperty(second, "offsetTop", { value: 0, configurable: true });
    grid.appendChild(first);
    grid.appendChild(second);
    container.appendChild(grid);
    const ref = { current: container };

    const { result } = renderHook(() => useHeroFeatureWrap(ref, true));

    act(() => {
      result.current.updateWrap();
    });

    expect(result.current.wrapped).toBe(false);
  });

  it("returns early when container is null", () => {
    const ref = { current: null };

    const { result } = renderHook(() => useHeroFeatureWrap(ref, true));

    act(() => {
      result.current.updateWrap();
    });

    expect(result.current.wrapped).toBe(false);
  });

  it("keeps wrapped false when there are no feature grids", () => {
    const container = document.createElement("div");
    const ref = { current: container };

    const { result } = renderHook(() => useHeroFeatureWrap(ref, true));

    act(() => {
      result.current.updateWrap();
    });

    expect(result.current.wrapped).toBe(false);
  });

  it("keeps wrapped false when grid has less than two items", () => {
    const container = document.createElement("div");
    const grid = document.createElement("div");
    grid.setAttribute("data-hero-features", "true");
    const first = document.createElement("div");
    Object.defineProperty(first, "offsetTop", { value: 0, configurable: true });
    grid.appendChild(first);
    container.appendChild(grid);
    const ref = { current: container };

    const { result } = renderHook(() => useHeroFeatureWrap(ref, true));

    act(() => {
      result.current.updateWrap();
    });

    expect(result.current.wrapped).toBe(false);
  });

  it("keeps wrapped false when disabled", () => {
    const { container } = createFeatureGrid();
    const ref = { current: container };

    const { result } = renderHook(() => useHeroFeatureWrap(ref, false));

    act(() => {
      result.current.updateWrap();
    });

    expect(result.current.wrapped).toBe(false);
  });

  it("attaches observer/resize listeners and cleans up on unmount", () => {
    const { container } = createFeatureGrid();
    const ref = { current: container };
    const addSpy = jest.spyOn(window, "addEventListener");
    const removeSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useHeroFeatureWrap(ref, true));

    expect(observe).toHaveBeenCalledWith(container);
    expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(resizeCb).toBeDefined();

    act(() => {
      resizeCb?.([] as any, {} as any);
    });

    unmount();

    expect(disconnect).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
