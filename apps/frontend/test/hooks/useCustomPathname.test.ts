import { renderHook } from "@testing-library/react";
import { useCustomPathname } from "@hooks/useCustomPathname";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn()
}));

const { usePathname } = jest.requireMock("next/navigation");

describe("useCustomPathname", () => {
  it("returns home for root path", () => {
    usePathname.mockReturnValue("/");
    const { result } = renderHook(() => useCustomPathname());
    expect(result.current).toBe("home");
  });

  it("returns first path segment", () => {
    usePathname.mockReturnValue("/planes/detalle");
    const { result } = renderHook(() => useCustomPathname());
    expect(result.current).toBe("planes");
  });
});
