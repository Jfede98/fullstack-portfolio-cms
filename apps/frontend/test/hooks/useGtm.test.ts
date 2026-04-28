import { renderHook } from "@testing-library/react";
import { useGtm } from "@hooks/useGtm";

describe("useGtm", () => {
  const originalWindow = window;

  beforeEach(() => {
    (window as any).dataLayer = [];
  });

  it("pushes event with formatted phone when provided", () => {
    const { result } = renderHook(() => useGtm());
    result.current.addEvent({ event: "click", ph: "0987654321" } as any);

    expect((window as any).dataLayer[0]).toEqual(
      expect.objectContaining({
        event: "click",
        ph: "593987654321"
      })
    );
  });

  it("uses default phone when not provided", () => {
    const { result } = renderHook(() => useGtm());
    result.current.addEvent({ event: "view" } as any);

    expect((window as any).dataLayer[0]).toEqual(
      expect.objectContaining({
        event: "view",
        ph: "593986911813"
      })
    );
  });

  it("does nothing when window is undefined", () => {
    (globalThis as any).window = undefined;
    const { result } = renderHook(() => useGtm());
    expect(() => result.current.addEvent({ event: "view" } as any)).not.toThrow();
    (globalThis as any).window = originalWindow;
  });

  it("handles missing dataLayer safely", () => {
    (window as any).dataLayer = undefined;
    const { result } = renderHook(() => useGtm());
    expect(() => result.current.addEvent({ event: "view" } as any)).not.toThrow();
  });
});
