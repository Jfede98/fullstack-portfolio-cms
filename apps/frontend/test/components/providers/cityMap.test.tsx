import { render, act } from "@testing-library/react";
import { CityMapProvider } from "@components/providers/cityMap";
import { CityMapContext } from "@context/cityMap";

describe("CityMapProvider", () => {
  it("updates map config and notifies address changes", () => {
    const onAddressChange = jest.fn();
    let ctxValue: any;

    render(
      <CityMapProvider onAddressChange={onAddressChange}>
        <CityMapContext.Consumer>
          {(value) => {
            ctxValue = value;
            return null;
          }}
        </CityMapContext.Consumer>
      </CityMapProvider>
    );

    act(() => {
      ctxValue.setMapConfig("google", "token");
      ctxValue.setSelectedAddress({ latitude: 1, longitude: 2, label: "addr" });
    });

    expect(onAddressChange).toHaveBeenCalledWith({
      latitude: 1,
      longitude: 2,
      label: "addr"
    });
  });
});
