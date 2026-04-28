import { act, renderHook } from "@testing-library/react";
import { useModal } from "@hooks/providers/useModal";
import { RenderModalType } from "@lib/constants/state";

describe("useModal", () => {
  it("updates state and type", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.handlerState(true);
      result.current?.handlerModalType?.(RenderModalType.CONTACT_FORM);
    });

    expect(result.current.state).toBe(true);
    expect(result.current.type).toBe(RenderModalType.CONTACT_FORM);
  });
});
