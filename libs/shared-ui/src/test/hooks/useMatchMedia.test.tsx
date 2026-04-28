import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMatchMedia } from "../../lib/hooks/useMatchMedia";
import { Screen } from "@shared-ui/constants/state";

describe("useMatchMedia", () => {
  let listeners: Array<(e: MediaQueryListEvent) => void> = [];

  beforeEach(() => {
    listeners = [];

    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        media: query,
        matches: false,
        addEventListener: (_: string, cb: any) => {
          listeners.push(cb);
        },
        removeEventListener: (_: string, cb: any) => {
          listeners = listeners.filter((l) => l !== cb);
        }
      }))
    );
  });

  it("returns isDesktop = false by default", () => {
    const { result } = renderHook(() => useMatchMedia());
    expect(result.current.isDesktop).toBe(false);
  });

  it("sets isDesktop = true when media query matches", () => {
    (window.matchMedia as any).mockImplementationOnce(() => ({
      media: `(min-width: ${Screen.lg}px)`,
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));

    const { result } = renderHook(() => useMatchMedia(Screen.lg));
    expect(result.current.isDesktop).toBe(true);
  });

  it("updates isDesktop when media query changes", () => {
    const { result } = renderHook(() => useMatchMedia(Screen.lg));

    expect(result.current.isDesktop).toBe(false);

    act(() => {
      listeners.forEach((listener) =>
        listener({ matches: true } as MediaQueryListEvent)
      );
    });

    expect(result.current.isDesktop).toBe(true);

    act(() => {
      listeners.forEach((listener) =>
        listener({ matches: false } as MediaQueryListEvent)
      );
    });

    expect(result.current.isDesktop).toBe(false);
  });
});
