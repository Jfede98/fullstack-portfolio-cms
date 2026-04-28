import { render, screen } from "@testing-library/react";
import { MapBlock } from "@components/map";

const MapComponentMock: any = jest.fn(() => <div data-testid="map-component" />);

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => (props: any) => MapComponentMock(props),
}));

jest.mock("@sitio-publico/shared-ui", () => ({
  MapComponent: (props: any) => MapComponentMock(props)
}));

const mockSetMapConfig = jest.fn();
const mockSetSelectedAddress = jest.fn();
const mockSetManualPinMode = jest.fn();
let mockContextValue: {
  selectedCity: string | null;
  selectedAddress: { latitude: number; longitude: number; label: string } | null;
  setSelectedAddress: jest.Mock;
  manualPinMode: boolean;
  setManualPinMode: jest.Mock;
  mapProvider: "mapbox" | "google";
  mapToken: string;
  setMapConfig: jest.Mock;
} = {
  selectedCity: null,
  selectedAddress: null,
  setSelectedAddress: mockSetSelectedAddress,
  manualPinMode: false,
  setManualPinMode: mockSetManualPinMode,
  mapProvider: "mapbox",
  mapToken: "",
  setMapConfig: mockSetMapConfig
};

jest.mock("@context/cityMap", () => {
  const React = require("react");
  return {
    CityMapContext: React.createContext(null)
  };
});

const { CityMapContext } = require("@context/cityMap");

describe("MapBlock", () => {
  beforeEach(() => {
    MapComponentMock.mockClear();
    mockSetMapConfig.mockClear();
    mockSetSelectedAddress.mockClear();
    mockSetManualPinMode.mockClear();
    mockContextValue = {
      selectedCity: null,
      selectedAddress: null,
      setSelectedAddress: mockSetSelectedAddress,
      manualPinMode: false,
      setManualPinMode: mockSetManualPinMode,
      mapProvider: "mapbox",
      mapToken: "",
      setMapConfig: mockSetMapConfig
    };
  });

  const renderWithContext = (ui: React.ReactElement) =>
    render(
      <CityMapContext.Provider value={mockContextValue}>
        {ui}
      </CityMapContext.Provider>
    );

  it("renders MapComponent with provider and token", () => {
    renderWithContext(<MapBlock provider="mapbox" token="pk.test_token" />);

    expect(screen.getByTestId("map-component")).toBeInTheDocument();
    expect(MapComponentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "mapbox",
        token: "pk.test_token",
        className: "h-[400px] w-full"
      })
    );
  });

  it("renders MapComponent with google provider and token", () => {
    renderWithContext(<MapBlock provider="google" token="AIzaSy.test_key" />);

    expect(MapComponentMock).toHaveBeenCalledWith(
      expect.objectContaining({ provider: "google", token: "AIzaSy.test_key" })
    );
  });

  it("renders MapComponent without optional props", () => {
    renderWithContext(<MapBlock />);

    expect(MapComponentMock).toHaveBeenCalledWith(
      expect.objectContaining({ provider: undefined, token: undefined, className: "h-[400px] w-full" })
    );
  });

  it("forwards className to MapComponent", () => {
    renderWithContext(<MapBlock provider="mapbox" token="pk.abc" />);
    expect(MapComponentMock.mock.calls[0][0].className).toBe("h-[400px] w-full");
  });

  it("passes cityName when no address is selected", () => {
    mockContextValue.selectedCity = "Quito";
    renderWithContext(<MapBlock provider="mapbox" token="pk.abc" />);

    expect(MapComponentMock).toHaveBeenCalledWith(
      expect.objectContaining({ cityName: "Quito", latitude: undefined, longitude: undefined, markers: [] })
    );
  });

  it("suppresses cityName and passes coordinates when address is selected", () => {
    mockContextValue.selectedAddress = { latitude: -0.22, longitude: -78.5, label: "Av. República 123" };
    renderWithContext(<MapBlock provider="mapbox" token="pk.abc" />);

    expect(MapComponentMock).toHaveBeenCalledWith(
      expect.objectContaining({ cityName: undefined, latitude: -0.22, longitude: -78.5, zoom: 18 })
    );
  });

  it("passes a colored marker when address is selected", () => {
    mockContextValue.selectedAddress = { latitude: -0.22, longitude: -78.5, label: "Av. República 123" };
    renderWithContext(<MapBlock provider="mapbox" token="pk.abc" />);

    expect(MapComponentMock.mock.calls[0][0].markers).toEqual([
      { latitude: -0.22, longitude: -78.5, title: "Av. República 123", color: "#E63946" }
    ]);
  });

  it("passes empty markers when no address is selected", () => {
    renderWithContext(<MapBlock provider="mapbox" token="pk.abc" />);
    expect(MapComponentMock).toHaveBeenCalledWith(expect.objectContaining({ markers: [] }));
  });

  it("calls setMapConfig when provider and token are provided", () => {
    renderWithContext(<MapBlock provider="mapbox" token="pk.abc" />);
    expect(mockSetMapConfig).toHaveBeenCalledWith("mapbox", "pk.abc");
  });

  it("does not call setMapConfig when provider or token is missing", () => {
    renderWithContext(<MapBlock />);
    expect(mockSetMapConfig).not.toHaveBeenCalled();
  });

  it("passes onMapClick only when manual pin mode is active", () => {
    renderWithContext(<MapBlock provider="mapbox" token="pk.abc" />);
    expect(MapComponentMock.mock.calls[0][0].onMapClick).toBeUndefined();

    MapComponentMock.mockClear();
    mockContextValue.manualPinMode = true;
    renderWithContext(<MapBlock provider="mapbox" token="pk.abc" />);
    expect(MapComponentMock.mock.calls[0][0].onMapClick).toEqual(expect.any(Function));
  });

  it("passes onMarkerDragEnd only when a selected address exists", () => {
    renderWithContext(<MapBlock provider="mapbox" token="pk.abc" />);
    expect(MapComponentMock.mock.calls[0][0].onMarkerDragEnd).toBeUndefined();

    MapComponentMock.mockClear();
    mockContextValue.selectedAddress = { latitude: -0.22, longitude: -78.5, label: "Av. República 123" };
    renderWithContext(<MapBlock provider="mapbox" token="pk.abc" />);
    expect(MapComponentMock.mock.calls[0][0].onMarkerDragEnd).toEqual(expect.any(Function));
  });

  it("shows visual instruction over map when manual pin mode is active", () => {
    mockContextValue.manualPinMode = true;
    renderWithContext(<MapBlock provider="mapbox" token="pk.abc" />);
    expect(
      screen.getByText("Haz clic en el mapa para fijar tu ubicación")
    ).toBeInTheDocument();
  });
});
