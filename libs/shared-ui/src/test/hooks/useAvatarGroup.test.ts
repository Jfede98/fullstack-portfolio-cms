import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useAvatarGroup } from "../../lib/hooks/avatar/useAvatarGroup";

describe("useAvatarGroup", () => {
  it("debe separar activos y otros correctamente", () => {
    const avatars = [
      { id: 1, name: "Alice", active: false },
      { id: 2, name: "Bob", active: true },
      { id: 3, name: "Charlie", active: false },
      { id: 4, name: "Dana", active: true }
    ];

    const { result } = renderHook(() => useAvatarGroup({ avatars }));

    expect(result.current.sortedAvatars.map((a) => a.id)).toEqual([1, 3, 2, 4]);
  });

  it("devuelve un array vacío si no hay avatars", () => {
    const { result } = renderHook(() => useAvatarGroup({ avatars: [] }));

    expect(result.current.sortedAvatars).toEqual([]);
  });

  it("mantiene referencia si avatars no cambian", () => {
    const avatars = [
      { id: 1, name: "Alice", active: false },
      { id: 2, name: "Bob", active: true }
    ];

    const { result, rerender } = renderHook(
      ({ avatars }) => useAvatarGroup({ avatars }),
      { initialProps: { avatars } }
    );

    const firstResult = result.current.sortedAvatars;

    rerender({ avatars });

    expect(result.current.sortedAvatars).toBe(firstResult);
  });
});
