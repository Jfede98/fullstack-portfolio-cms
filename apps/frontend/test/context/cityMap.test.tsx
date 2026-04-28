import { renderHook } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { CityMapContext } from "@context/cityMap";

jest.mock("@components/providers/cityMapBridge", () => ({
  CityMapBridge: ({ children }: any) => children
}));

const ContextReader = () => {
  const ctx = useContext(CityMapContext);
  return (
    <div data-testid="ctx">
      {ctx.selectedCity ?? "null"}|
      {ctx.selectedAddress ? JSON.stringify(ctx.selectedAddress) : "null"}|
      {ctx.mapProvider}|
      {ctx.mapToken}
    </div>
  );
};

describe("CityMapContext", () => {
  it("provides correct default values", () => {
    render(<ContextReader />);
    const text = screen.getByTestId("ctx").textContent;
    expect(text).toContain("null|null|mapbox|");
  });

  it("allows overriding values via Provider", () => {
    const value = {
      selectedCity: "Quito",
      setSelectedCity: jest.fn(),
      selectedAddress: { latitude: -0.22, longitude: -78.5, label: "Av. Test" },
      setSelectedAddress: jest.fn(),
      manualPinMode: true,
      setManualPinMode: jest.fn(),
      mapProvider: "google" as const,
      mapToken: "AIza-test",
      setMapConfig: jest.fn()
    };

    render(
      <CityMapContext.Provider value={value}>
        <ContextReader />
      </CityMapContext.Provider>
    );

    const text = screen.getByTestId("ctx").textContent;
    expect(text).toContain("Quito");
    expect(text).toContain("google");
    expect(text).toContain("AIza-test");
  });

  it("default setSelectedCity is a no-op function", () => {
    const { result } = renderHook(() => useContext(CityMapContext));
    expect(() => result.current.setSelectedCity("test")).not.toThrow();
  });

  it("default setSelectedAddress is a no-op function", () => {
    const { result } = renderHook(() => useContext(CityMapContext));
    expect(() =>
      result.current.setSelectedAddress({ latitude: 0, longitude: 0, label: "test" })
    ).not.toThrow();
  });

  it("default setMapConfig is a no-op function", () => {
    const { result } = renderHook(() => useContext(CityMapContext));
    expect(() => result.current.setMapConfig("mapbox", "token")).not.toThrow();
  });

  it("default setManualPinMode is a no-op function", () => {
    const { result } = renderHook(() => useContext(CityMapContext));
    expect(() => result.current.setManualPinMode(true)).not.toThrow();
  });
});
