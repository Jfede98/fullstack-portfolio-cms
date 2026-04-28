import { renderHook, act } from "@testing-library/react";
import { useContext } from "react";
import { SemiautomaticFlowContext } from "@context/semiautomaticFlow";

describe("SemiautomaticFlowContext", () => {
  it("provides a no-op onAddressChange by default", () => {
    const { result } = renderHook(() => useContext(SemiautomaticFlowContext));
    expect(() =>
      result.current.onAddressChange({ latitude: -0.22, longitude: -78.5, label: "Test" })
    ).not.toThrow();
  });

  it("allows overriding onAddressChange via Provider", () => {
    const onAddressChange = jest.fn();

    const { result } = renderHook(() => useContext(SemiautomaticFlowContext), {
      wrapper: ({ children }: any) => (
        <SemiautomaticFlowContext.Provider value={{ onAddressChange, goToNextStep: () => {}, selectPlan: () => {}, isActive: false }}>
          {children}
        </SemiautomaticFlowContext.Provider>
      )
    });

    act(() => {
      result.current.onAddressChange({ latitude: -0.22, longitude: -78.5, label: "Av. Test" });
    });

    expect(onAddressChange).toHaveBeenCalledWith({
      latitude: -0.22,
      longitude: -78.5,
      label: "Av. Test"
    });
  });
});

