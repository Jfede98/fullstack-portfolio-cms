import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDropdown } from "../../lib/hooks/useDropdown";

describe("useDropdown hook", () => {
  it("should use internal state when active prop is undefined", () => {
    const onActiveMock = vi.fn();
    const { result } = renderHook(() => useDropdown({ onActive: onActiveMock }));

    expect(result.current.active).toBe(false);

    act(() => {
      result.current.toggleActive();
    });

    expect(result.current.active).toBe(true);
    expect(onActiveMock).toHaveBeenCalledWith(true);

    act(() => {
      result.current.toggleActive();
    });

    expect(result.current.active).toBe(false);
    expect(onActiveMock).toHaveBeenCalledWith(false);
  });

  it("should use prop active when defined and not change internal state", () => {
    const onActiveMock = vi.fn();
    const { result } = renderHook(() => useDropdown({ active: true, onActive: onActiveMock }));

    expect(result.current.active).toBe(true);
    act(() => {
      result.current.toggleActive();
    });

    expect(result.current.active).toBe(true);
    expect(onActiveMock).toHaveBeenCalledWith(false);
  });

  it("should not fail if onActive is undefined", () => {
    const { result } = renderHook(() => useDropdown({ active: false }));

    act(() => {
      result.current.toggleActive();
    });

    expect(result.current.active).toBe(false);
  });
});
