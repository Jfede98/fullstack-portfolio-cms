import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GoogleMapInner } from "@shared-ui/components/mapComponent/GoogleMapComponent";

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockPanTo = vi.fn();
const mockSetZoom = vi.fn();
const mockFitBounds = vi.fn();

const mockGoogleMap = { panTo: mockPanTo, setZoom: mockSetZoom, fitBounds: mockFitBounds };
const mockGeocoder = { geocode: vi.fn() };
const mockLatLngBounds = { extend: vi.fn() };

const mockAdvancedMarkerElement = vi.fn().mockImplementation(function (this: Record<string, unknown>, options: Record<string, unknown>) {
  Object.assign(this, options);
});

const mockPinElement = vi.fn().mockImplementation(function (this: { element?: Record<string, unknown> }, options: Record<string, unknown>) {
  this.element = options;
});

const mockImportLibrary = vi.fn(async (libraryName: string) => {
  if (libraryName === "marker") {
    return {
      AdvancedMarkerElement: mockAdvancedMarkerElement,
      PinElement: mockPinElement,
    };
  }
  return {};
});

let lastGoogleMapProps: Record<string, unknown> = {};

vi.mock("@react-google-maps/api", () => ({
  GoogleMap: vi.fn((props: Record<string, unknown>) => {
    lastGoogleMapProps = props;
    if (typeof props.onLoad === "function") props.onLoad(mockGoogleMap);
    return <div data-testid="google-map">{props.children as React.ReactNode}</div>;
  }),
  Marker: vi.fn(() => <div data-testid="google-marker" />),
  useJsApiLoader: vi.fn(() => ({ isLoaded: true, loadError: undefined })),
}));

const setupGoogleMock = () => {
  window.google = {
    maps: {
      Geocoder: function () { return mockGeocoder; },
      LatLngBounds: function () { return mockLatLngBounds; },
      importLibrary: mockImportLibrary,
    },
  } as unknown as typeof google;
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("GoogleMapInner", () => {
  beforeEach(() => {
    setupGoogleMock();
    vi.clearAllMocks();
    lastGoogleMapProps = {};
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Loading state", () => {
    it("shows loader when map is not ready", async () => {
      const { useJsApiLoader } = await import("@react-google-maps/api");
      vi.mocked(useJsApiLoader).mockReturnValueOnce({ isLoaded: false, loadError: undefined });

      render(<GoogleMapInner token="test-token" />);
      expect(screen.getByText("Cargando mapa…")).toBeDefined();
    });

    it("shows map when isLoaded is true", () => {
      render(<GoogleMapInner token="test-token" />);
      expect(screen.getByTestId("google-map")).toBeDefined();
    });
  });

  describe("Error handling", () => {
    it("shows error when loadError is present", async () => {
      const { useJsApiLoader } = await import("@react-google-maps/api");
      vi.mocked(useJsApiLoader).mockReturnValueOnce({
        isLoaded: false,
        loadError: new Error("InvalidKeyMapError: clave inválida"),
      });

      render(<GoogleMapInner token="bad-token" />);
      expect(screen.getByText("API Key inválida, vacía o expirada")).toBeDefined();
    });

    it("shows unauthorized domain error (RefererNotAllowedMapError)", async () => {
      render(<GoogleMapInner token="test-token" />);

      await act(async () => {
        window.dispatchEvent(new ErrorEvent("error", { message: "RefererNotAllowedMapError: domain not allowed" }));
      });

      expect(screen.getByText("Dominio no autorizado en la API Key")).toBeDefined();
    });

    it("shows API not enabled error (ApiNotActivatedMapError)", async () => {
      render(<GoogleMapInner token="test-token" />);

      await act(async () => {
        window.dispatchEvent(new ErrorEvent("error", { message: "ApiNotActivatedMapError: not enabled" }));
      });

      expect(screen.getByText("Maps JavaScript API no habilitada")).toBeDefined();
    });

    it("shows error for expired key (ExpiredKeyMapError)", async () => {
      render(<GoogleMapInner token="test-token" />);

      await act(async () => {
        window.dispatchEvent(new ErrorEvent("error", { message: "ExpiredKeyMapError: key expired" }));
      });

      expect(screen.getByText("API Key inválida, vacía o expirada")).toBeDefined();
    });

    it("detects map errors via window.message", async () => {
      render(<GoogleMapInner token="test-token" />);

      await act(async () => {
        window.dispatchEvent(new MessageEvent("message", { data: "MissingKeyMapError: no key" }));
      });

      expect(screen.getByText("API Key inválida, vacía o expirada")).toBeDefined();
    });

    it("does not show error when message is not from Google Maps", async () => {
      render(<GoogleMapInner token="test-token" />);

      await act(async () => {
        window.dispatchEvent(new ErrorEvent("error", { message: "some unrelated error" }));
      });

      expect(screen.queryByText("Error de Google Maps")).toBeNull();
      expect(screen.getByTestId("google-map")).toBeDefined();
    });

    it("removes event listeners on unmount", () => {
      const removeSpy = vi.spyOn(window, "removeEventListener");
      const { unmount } = render(<GoogleMapInner token="test-token" />);
      unmount();
      expect(removeSpy).toHaveBeenCalledWith("error", expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith("message", expect.any(Function));
    });
  });

  describe("Center and zoom", () => {
    it("uses ECUADOR_CENTER and zoom 6 when no coordinates are given", () => {
      render(<GoogleMapInner token="test-token" />);
      expect(lastGoogleMapProps.center).toEqual({ lat: -1.8312, lng: -78.1834 });
      expect(lastGoogleMapProps.zoom).toBe(6);
    });

    it("uses provided coordinates when available", () => {
      render(<GoogleMapInner token="test-token" latitude={-0.22} longitude={-78.5} zoom={14} />);
      expect(lastGoogleMapProps.center).toEqual({ lat: -0.22, lng: -78.5 });
      expect(lastGoogleMapProps.zoom).toBe(14);
    });

    it("defaults to zoom 12 when coordinates are given but zoom is not", () => {
      render(<GoogleMapInner token="test-token" latitude={-0.22} longitude={-78.5} />);
      expect(lastGoogleMapProps.zoom).toBe(12);
    });

    it("calls panTo and setZoom when coordinates change", async () => {
      const { rerender } = render(
        <GoogleMapInner token="test-token" latitude={-0.22} longitude={-78.5} zoom={12} />
      );

      await act(async () => {
        rerender(<GoogleMapInner token="test-token" latitude={-2.0} longitude={-79.0} zoom={15} />);
      });

      expect(mockPanTo).toHaveBeenCalledWith({ lat: -2.0, lng: -79.0 });
      expect(mockSetZoom).toHaveBeenCalledWith(15);
    });
  });

  describe("cityName geocoding", () => {
    it("calls geocoder.geocode with the provided cityName", async () => {
      mockGeocoder.geocode.mockImplementationOnce(
        (_: unknown, cb: (r: unknown[], s: string) => void) => {
          cb([{ geometry: { location: { lat: () => -0.22, lng: () => -78.5 }, viewport: {} } }], "OK");
        }
      );

      render(<GoogleMapInner token="test-token" cityName="Quito" />);
      await act(async () => {});

      expect(mockGeocoder.geocode).toHaveBeenCalledWith({ address: "Quito" }, expect.any(Function));
    });

    it("does not call geocoder when cityName is empty", async () => {
      render(<GoogleMapInner token="test-token" />);
      await act(async () => {});
      expect(mockGeocoder.geocode).not.toHaveBeenCalled();
    });
  });

  describe("Markers", () => {
    it("creates one advanced marker per item in the markers array", async () => {
      const markers = [
        { latitude: -0.22, longitude: -78.5, title: "Point A" },
        { latitude: -2.0, longitude: -79.0, title: "Point B" },
      ];

      render(<GoogleMapInner token="test-token" markers={markers} />);
      await act(async () => {});

      expect(mockImportLibrary).toHaveBeenCalledWith("marker");
      expect(mockAdvancedMarkerElement).toHaveBeenCalledTimes(2);
      expect(mockAdvancedMarkerElement.mock.calls[0]?.[0]).toMatchObject({ title: "Point A" });
      expect(mockAdvancedMarkerElement.mock.calls[1]?.[0]).toMatchObject({ title: "Point B" });
    });

    it("creates no advanced markers when the array is empty", async () => {
      render(<GoogleMapInner token="test-token" markers={[]} />);
      await act(async () => {});
      expect(mockAdvancedMarkerElement).not.toHaveBeenCalled();
    });

    it("calls LatLngBounds.extend once per marker when there is no explicit center", () => {
      const markers = [
        { latitude: -0.22, longitude: -78.5 },
        { latitude: -2.0, longitude: -79.0 },
      ];
      render(<GoogleMapInner token="test-token" markers={markers} />);
      expect(mockLatLngBounds.extend).toHaveBeenCalledTimes(2);
    });
  });

  describe("Map click", () => {
    it("calls onMapClick with coordinates when user clicks the map", () => {
      const onMapClick = vi.fn();
      render(<GoogleMapInner token="test-token" onMapClick={onMapClick} />);

      const onClick = lastGoogleMapProps.onClick as (event: {
        latLng: { lat: () => number; lng: () => number };
      }) => void;

      onClick({
        latLng: {
          lat: () => -2.170998,
          lng: () => -79.922359,
        },
      });

      expect(onMapClick).toHaveBeenCalledWith({
        latitude: -2.170998,
        longitude: -79.922359,
      });
    });
  });
});
