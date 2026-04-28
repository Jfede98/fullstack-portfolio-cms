import { render, screen, act } from "@testing-library/react";
import { MapBlock } from "@components/map";
import { CityMapContext } from "@context/cityMap";

const reverseGeocodeMapboxMock = jest.fn();
const reverseGeocodeGoogleMock = jest.fn();

jest.mock("@hooks/useAddressAutocomplete", () => ({
  reverseGeocodeMapbox: (...args: unknown[]) => reverseGeocodeMapboxMock(...args),
  reverseGeocodeGoogle: (...args: unknown[]) => reverseGeocodeGoogleMock(...args)
}));

let lastMapProps: any = null;
jest.mock("next/dynamic", () => () => {
  const React = require("react");
  return (props: any) => {
    lastMapProps = props;
    return React.createElement("div", { "data-testid": "map" });
  };
});

describe("MapBlock", () => {
  beforeEach(() => {
    reverseGeocodeMapboxMock.mockReset();
    reverseGeocodeGoogleMock.mockReset();
    lastMapProps = null;
  });

  it("renders map and handles mapbox reverse geocode", async () => {
    reverseGeocodeMapboxMock.mockResolvedValue({ label: "Mapbox Addr" });
    (global as any).IntersectionObserver = undefined;

    const setSelectedAddress = jest.fn();
    const setManualPinMode = jest.fn();
    const setMapConfig = jest.fn();

    render(
      <CityMapContext.Provider
        value={{
          selectedCity: "Quito",
          selectedAddress: null,
          manualPinMode: true,
          setSelectedCity: jest.fn(),
          setSelectedAddress,
          setManualPinMode,
          mapProvider: "mapbox",
          mapToken: "token",
          setMapConfig
        }}
      >
        <MapBlock provider="mapbox" token="token" />
      </CityMapContext.Provider>
    );

    await lastMapProps.onMapClick({ latitude: 1, longitude: 2 });

    expect(setSelectedAddress).toHaveBeenCalledWith({
      latitude: 1,
      longitude: 2,
      label: "Ubicación seleccionada"
    });
    await Promise.resolve();
    expect(reverseGeocodeMapboxMock).toHaveBeenCalledWith(1, 2, "token");
    expect(setMapConfig).toHaveBeenCalledWith("mapbox", "token");
    expect(setManualPinMode).toHaveBeenCalledWith(false);
  });

  it("handles google reverse geocode on marker drag", async () => {
    reverseGeocodeGoogleMock.mockResolvedValue({ label: "Google Addr" });
    (global as any).IntersectionObserver = undefined;

    const setSelectedAddress = jest.fn();
    const setManualPinMode = jest.fn();

    render(
      <CityMapContext.Provider
        value={{
          selectedCity: "Quito",
          selectedAddress: { latitude: 1, longitude: 2, label: "prev" },
          manualPinMode: false,
          setSelectedCity: jest.fn(),
          setSelectedAddress,
          setManualPinMode,
          mapProvider: "google",
          mapToken: "token",
          setMapConfig: jest.fn()
        }}
      >
        <MapBlock provider="google" token="token" />
      </CityMapContext.Provider>
    );

    await lastMapProps.onMarkerDragEnd({ latitude: 3, longitude: 4, markerIndex: 0 });
    expect(reverseGeocodeGoogleMock).toHaveBeenCalled();
  });

  it("does not expose map click handler when manual pin is off", () => {
    (global as any).IntersectionObserver = undefined;

    render(
      <CityMapContext.Provider
        value={{
          selectedCity: "Quito",
          selectedAddress: null,
          manualPinMode: false,
          setSelectedCity: jest.fn(),
          setSelectedAddress: jest.fn(),
          setManualPinMode: jest.fn(),
          mapProvider: "mapbox",
          mapToken: "token",
          setMapConfig: jest.fn()
        }}
      >
        <MapBlock provider="mapbox" token="token" />
      </CityMapContext.Provider>
    );

    expect(lastMapProps.onMapClick).toBeUndefined();
  });

  it("shows loading placeholder when map is not visible yet", () => {
    const observeMock = jest.fn();
    const disconnectMock = jest.fn();
    (global as any).IntersectionObserver = function (cb: any) {
      return { observe: observeMock, disconnect: disconnectMock };
    };

    render(
      <CityMapContext.Provider
        value={{
          selectedCity: null,
          selectedAddress: null,
          manualPinMode: false,
          setSelectedCity: jest.fn(),
          setSelectedAddress: jest.fn(),
          setManualPinMode: jest.fn(),
          mapProvider: "mapbox",
          mapToken: "",
          setMapConfig: jest.fn()
        }}
      >
        <MapBlock provider="mapbox" token="" />
      </CityMapContext.Provider>
    );

    expect(observeMock).toHaveBeenCalled();
  });

  it("renders manual pin banner when manual pin mode is enabled", () => {
    (global as any).IntersectionObserver = undefined;
    render(
      <CityMapContext.Provider
        value={{
          selectedCity: "Quito",
          selectedAddress: null,
          manualPinMode: true,
          setSelectedCity: jest.fn(),
          setSelectedAddress: jest.fn(),
          setManualPinMode: jest.fn(),
          mapProvider: "mapbox",
          mapToken: "token",
          setMapConfig: jest.fn()
        }}
      >
        <MapBlock provider="mapbox" token="token" />
      </CityMapContext.Provider>
    );

    expect(screen.getByText("Haz clic en el mapa para fijar tu ubicación")).toBeInTheDocument();
  });

  it("handles true intersection from observer", () => {
    let cb: any;
    (global as any).IntersectionObserver = function (callback: any) {
      cb = callback;
      return { observe: jest.fn(), disconnect: jest.fn() };
    };

    render(
      <CityMapContext.Provider
        value={{
          selectedCity: "Quito",
          selectedAddress: null,
          manualPinMode: false,
          setSelectedCity: jest.fn(),
          setSelectedAddress: jest.fn(),
          setManualPinMode: jest.fn(),
          mapProvider: "mapbox",
          mapToken: "token",
          setMapConfig: jest.fn()
        }}
      >
        <MapBlock provider="mapbox" token="token" />
      </CityMapContext.Provider>
    );

    act(() => {
      cb([{ isIntersecting: true }]);
    });
    expect(lastMapProps).toBeTruthy(); // lazy map component rendered
  });

  it("handles resolving geocode with stateful context", async () => {
    reverseGeocodeMapboxMock.mockResolvedValue({ label: "Final Addr" });
    (global as any).IntersectionObserver = undefined;

    const Wrapper = () => {
      const React = require("react");
      const [addr, setAddr] = React.useState<any>(null);
      return (
        <CityMapContext.Provider
          value={{
            selectedCity: "Quito",
            selectedAddress: addr,
            manualPinMode: true,
            setSelectedCity: jest.fn(),
            setSelectedAddress: setAddr,
            setManualPinMode: jest.fn(),
            mapProvider: "mapbox",
            mapToken: "token",
            setMapConfig: jest.fn()
          }}
        >
          <MapBlock provider="mapbox" token="token" />
        </CityMapContext.Provider>
      );
    }
    
    render(<Wrapper />);
    await act(async () => {
      await lastMapProps.onMapClick({ latitude: 10, longitude: 20 });
    });
    // wait for state resolution
    await screen.findByTestId("map");
  });
});
