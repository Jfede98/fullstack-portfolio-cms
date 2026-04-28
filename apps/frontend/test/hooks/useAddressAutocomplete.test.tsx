import { renderHook, act, waitFor } from "@testing-library/react";
import { useAddressAutocomplete, reverseGeocodeMapbox, reverseGeocodeGoogle } from "@hooks/useAddressAutocomplete";

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

jest.mock("@context/cityMap", () => {
  const React = require("react");
  return { CityMapContext: React.createContext(null) };
});

const { CityMapContext } = require("@context/cityMap");

const mockSetSelectedAddress = jest.fn();

const makeWrapper = (selectedCity: string | null = null) =>
  ({ children }: any) => (
    <CityMapContext.Provider
      value={{
        selectedCity,
        selectedAddress: null,
        setSelectedAddress: mockSetSelectedAddress,
        manualPinMode: false,
        setManualPinMode: jest.fn(),
        mapProvider: "mapbox",
        mapToken: "pk.test",
        setSelectedCity: jest.fn(),
        setMapConfig: jest.fn()
      }}
    >
      {children}
    </CityMapContext.Provider>
  );

const MAPBOX_RESPONSE = {
  features: [
    { center: [-78.5, -0.22], place_name: "Av. República 123, Quito" },
    { center: [-78.6, -0.23], place_name: "Calle Test 456, Quito" }
  ]
};


function mockGoogleWithPlacesService(
  predictions: Array<{ place_id: string; description: string }>,
  placeDetailsMap: Record<string, { lat: number; lng: number; name?: string; formatted_address?: string }>
) {
  (global as any).google = {
    maps: {
      places: {
        AutocompleteService: function () {
          return {
            getPlacePredictions: (_: any, cb: any) => cb(predictions, "OK")
          };
        },
        PlacesService: function () {
          return {
            getDetails: (req: any, cb: any) => {
              const coords = placeDetailsMap[req.placeId];
              if (!coords) return cb(null, "NOT_FOUND");
              cb({
                geometry: { location: { lat: () => coords.lat, lng: () => coords.lng } },
                name: coords.name,
                formatted_address: coords.formatted_address,
              }, "OK");
            }
          };
        },
        AutocompleteSessionToken: function () { return {}; }
      }
    }
  };
}

function clearGoogleMock() {
  delete (global as any).google;
}

describe("useAddressAutocomplete", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    mockSetSelectedAddress.mockReset();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("onSearchChange – mapbox", () => {
    it("clears options when query is empty", () => {
      const { result } = renderHook(
        () => useAddressAutocomplete({ provider: "mapbox", mapboxToken: "pk.test" }),
        { wrapper: makeWrapper("Quito") }
      );

      act(() => { result.current.onSearchChange(""); });
      expect(result.current.addressOptions).toEqual([]);
    });

    it("fetches suggestions after debounce", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(MAPBOX_RESPONSE)
      });

      const { result } = renderHook(
        () => useAddressAutocomplete({ provider: "mapbox", mapboxToken: "pk.test" }),
        { wrapper: makeWrapper("Quito") }
      );

      act(() => { result.current.onSearchChange("Av. Rep"); });
      act(() => { jest.advanceTimersByTime(400); });

      await waitFor(() => {
        expect(result.current.addressOptions).toHaveLength(2);
        expect(result.current.addressOptions[0].label).toBe("Av. República 123, Quito");
      });
    });

    it("does not fetch when mapboxToken is missing", async () => {
      const { result } = renderHook(
        () => useAddressAutocomplete({ provider: "mapbox", mapboxToken: undefined }),
        { wrapper: makeWrapper("Quito") }
      );

      act(() => { result.current.onSearchChange("Av. Rep"); });
      act(() => { jest.advanceTimersByTime(400); });

      await waitFor(() => {
        expect(fetchMock).not.toHaveBeenCalled();
        expect(result.current.addressOptions).toEqual([]);
      });
    });

    it("sets loadingAddresses to true during fetch and false after", async () => {
      let resolve: (v: any) => void;
      fetchMock.mockReturnValueOnce(
        new Promise((r) => { resolve = r; })
      );

      const { result } = renderHook(
        () => useAddressAutocomplete({ provider: "mapbox", mapboxToken: "pk.test" }),
        { wrapper: makeWrapper() }
      );

      act(() => { result.current.onSearchChange("test"); });
      act(() => { jest.advanceTimersByTime(400); });

      await waitFor(() => expect(result.current.loadingAddresses).toBe(true));

      act(() => {
        resolve!({ ok: true, json: jest.fn().mockResolvedValue(MAPBOX_RESPONSE) });
      });

      await waitFor(() => expect(result.current.loadingAddresses).toBe(false));
    });

    it("returns empty options when fetch fails", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false });

      const { result } = renderHook(
        () => useAddressAutocomplete({ provider: "mapbox", mapboxToken: "pk.test" }),
        { wrapper: makeWrapper() }
      );

      act(() => { result.current.onSearchChange("fail"); });
      act(() => { jest.advanceTimersByTime(400); });

      await waitFor(() => {
        expect(result.current.addressOptions).toEqual([]);
        expect(result.current.loadingAddresses).toBe(false);
      });
    });

    it("handles mapbox features missing center and place_name", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          features: [{ text: "Fallback Text" }]
        })
      });

      const { result } = renderHook(
        () => useAddressAutocomplete({ provider: "mapbox", mapboxToken: "pk.test" }),
        { wrapper: makeWrapper("Quito") }
      );

      act(() => { result.current.onSearchChange("Fall"); });
      act(() => { jest.advanceTimersByTime(400); });

      await waitFor(() => {
        expect(result.current.addressOptions).toHaveLength(1);
        expect(result.current.addressOptions[0].label).toBe("Fallback Text");
      });
    });
  });

  describe("onSelectAddress", () => {
    it("calls setSelectedAddress with coordinates when a match is found", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(MAPBOX_RESPONSE)
      });

      const { result } = renderHook(
        () => useAddressAutocomplete({ provider: "mapbox", mapboxToken: "pk.test" }),
        { wrapper: makeWrapper("Quito") }
      );

      act(() => { result.current.onSearchChange("Av"); });
      act(() => { jest.advanceTimersByTime(400); });
      await waitFor(() => expect(result.current.addressOptions).toHaveLength(2));

      act(() => { result.current.onSelectAddress("Av. República 123, Quito"); });

      expect(mockSetSelectedAddress).toHaveBeenCalledWith({
        latitude: -0.22,
        longitude: -78.5,
        label: "Av. República 123, Quito"
      });
    });

    it("does not call setSelectedAddress when value is not in suggestions", () => {
      const { result } = renderHook(
        () => useAddressAutocomplete({ provider: "mapbox", mapboxToken: "pk.test" }),
        { wrapper: makeWrapper() }
      );

      act(() => { result.current.onSelectAddress("unknown"); });
      expect(mockSetSelectedAddress).not.toHaveBeenCalled();
    });
  });

  describe("resetAddress", () => {
    it("clears addressOptions and calls setSelectedAddress(null)", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(MAPBOX_RESPONSE)
      });

      const { result } = renderHook(
        () => useAddressAutocomplete({ provider: "mapbox", mapboxToken: "pk.test" }),
        { wrapper: makeWrapper() }
      );

      act(() => { result.current.onSearchChange("Av"); });
      act(() => { jest.advanceTimersByTime(400); });
      await waitFor(() => expect(result.current.addressOptions).toHaveLength(2));

      act(() => { result.current.resetAddress(); });

      expect(result.current.addressOptions).toEqual([]);
      expect(mockSetSelectedAddress).toHaveBeenCalledWith(null);
    });
  });

  describe("city change clears address", () => {
    it("clears options when selectedCity changes", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(MAPBOX_RESPONSE)
      });

      let currentCity = "Quito";
      const wrapper = ({ children }: any) => (
        <CityMapContext.Provider
          value={{
            selectedCity: currentCity,
            selectedAddress: null,
            setSelectedAddress: mockSetSelectedAddress,
            manualPinMode: false,
            setManualPinMode: jest.fn(),
            mapProvider: "mapbox",
            mapToken: "pk.test",
            setSelectedCity: jest.fn(),
            setMapConfig: jest.fn()
          }}
        >
          {children}
        </CityMapContext.Provider>
      );

      const { result, rerender } = renderHook(
        () => useAddressAutocomplete({ provider: "mapbox", mapboxToken: "pk.test" }),
        { wrapper }
      );

      act(() => { result.current.onSearchChange("Av"); });
      act(() => { jest.advanceTimersByTime(400); });
      await waitFor(() => expect(result.current.addressOptions).toHaveLength(2));

      currentCity = "Guayaquil";
      rerender();

      await waitFor(() => {
        expect(result.current.addressOptions).toEqual([]);
        expect(mockSetSelectedAddress).toHaveBeenCalledWith(null);
      });
    });
  });
});

describe("onSearchChange – google (PlacesService.getDetails)", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    mockSetSelectedAddress.mockReset();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    clearGoogleMock();
  });

  it("fetches Google suggestions via PlacesService.getDetails when google is loaded", async () => {
    mockGoogleWithPlacesService(
      [
        { place_id: "p1", description: "Av. 9 de Octubre, Guayaquil, Ecuador" },
        { place_id: "p2", description: "Av. 9 de Octubre N35, Quito, Ecuador" },
      ],
      {
        p1: {
          lat: -2.17,
          lng: -79.92,
          name: "Av. 9 de Octubre",
          formatted_address: "Guayaquil, Ecuador",
        },
        p2: {
          lat: -0.22,
          lng: -78.5,
          name: "Av. 9 de Octubre N35",
          formatted_address: "Quito, Ecuador",
        },
      }
    );

    const { result } = renderHook(
      () => useAddressAutocomplete({ provider: "google", mapboxToken: "google-api-key" }),
      { wrapper: makeWrapper("Guayaquil") }
    );

    act(() => { result.current.onSearchChange("Av. 9"); });
    act(() => { jest.advanceTimersByTime(400); });

    await waitFor(() => {
      expect(result.current.addressOptions).toHaveLength(2);
      expect(result.current.addressOptions[0].label).toBe("Av. 9 de Octubre, Guayaquil, Ecuador");
    });
  });

  it("keeps places and buildings in Google suggestions", async () => {
    mockGoogleWithPlacesService(
      [{ place_id: "p1", description: "Mall del Sol, Guayaquil, Ecuador" }],
      {
        p1: {
          lat: -2.14,
          lng: -79.88,
        },
      }
    );

    const { result } = renderHook(
      () => useAddressAutocomplete({ provider: "google", mapboxToken: "google-api-key" }),
      { wrapper: makeWrapper("Guayaquil") }
    );

    act(() => { result.current.onSearchChange("Mall del Sol"); });
    act(() => { jest.advanceTimersByTime(400); });

    await waitFor(() => {
      expect(result.current.addressOptions).toEqual([
        {
          label: "Mall del Sol, Guayaquil, Ecuador",
          value: "Mall del Sol, Guayaquil, Ecuador",
        },
      ]);
    });
  });

  it("handles missing AutocompleteService gracefully", async () => {
    (global as any).google = {
      maps: {
        places: {
          PlacesService: function () {
            return {};
          }
        }
      }
    };

    const { result } = renderHook(
      () => useAddressAutocomplete({ provider: "google", mapboxToken: "google-api-key" }),
      { wrapper: makeWrapper() }
    );

    act(() => { result.current.onSearchChange("test"); });
    act(() => { jest.advanceTimersByTime(400); });

    await waitFor(() => {
      expect(result.current.addressOptions).toEqual([]);
    });
  });

  it("returns zero results when getPlacePredictions returns ZERO_RESULTS", async () => {
    (global as any).google = {
      maps: {
        places: {
          AutocompleteService: function () {
            return {
              getPlacePredictions: (_: any, cb: any) => cb([], "ZERO_RESULTS")
            };
          },
          PlacesService: function () {
            return { getDetails: () => {} };
          }
        }
      }
    };

    const { result } = renderHook(
      () => useAddressAutocomplete({ provider: "google", mapboxToken: "google-api-key" }),
      { wrapper: makeWrapper() }
    );

    act(() => { result.current.onSearchChange("test"); });
    act(() => { jest.advanceTimersByTime(400); });

    await waitFor(() => {
      expect(result.current.addressOptions).toEqual([]);
    });
  });

  it("handles getDetails returning NOT_FOUND gracefully", async () => {
    mockGoogleWithPlacesService(
      [{ place_id: "unknown", description: "Unknown Place" }],
      {}
    );

    const { result } = renderHook(
      () => useAddressAutocomplete({ provider: "google", mapboxToken: "google-api-key" }),
      { wrapper: makeWrapper() }
    );

    act(() => { result.current.onSearchChange("unknown"); });
    act(() => { jest.advanceTimersByTime(400); });

    await waitFor(() => {
      expect(result.current.addressOptions).toEqual([]);
    });
  });

  it("onSelectAddress uses PlacesService coordinates (not geocoder centroid)", async () => {
    mockGoogleWithPlacesService(
      [{ place_id: "p1", description: "Av. Shyris, Quito, Ecuador" }],
      {
        p1: {
          lat: -0.18,
          lng: -78.49,
          name: "Av. Shyris",
          formatted_address: "Quito, Ecuador",
        },
      }
    );

    const { result } = renderHook(
      () => useAddressAutocomplete({ provider: "google", mapboxToken: "google-api-key" }),
      { wrapper: makeWrapper("Quito") }
    );

    act(() => { result.current.onSearchChange("Shyris"); });
    act(() => { jest.advanceTimersByTime(400); });

    await waitFor(() => expect(result.current.addressOptions).toHaveLength(1));

    act(() => { result.current.onSelectAddress("Av. Shyris, Quito, Ecuador"); });

    expect(mockSetSelectedAddress).toHaveBeenCalledWith({
      latitude: -0.18,
      longitude: -78.49,
      label: "Av. Shyris, Quito, Ecuador",
    });
  });

  it("falls back to REST geocoding when window.google is not loaded", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        status: "OK",
        results: [
          {
            formatted_address: "Av. de las Américas, Guayaquil, Ecuador",
            geometry: { location: { lat: -2.2, lng: -79.9 } },
          },
        ],
      }),
    });

    const { result } = renderHook(
      () => useAddressAutocomplete({ provider: "google", mapboxToken: "google-api-key" }),
      { wrapper: makeWrapper("Guayaquil") }
    );

    act(() => { result.current.onSearchChange("Américas"); });
    act(() => { jest.advanceTimersByTime(400); });

    await waitFor(() => {
      expect(result.current.addressOptions).toHaveLength(1);
      expect(result.current.addressOptions[0].label).toBe(
        "Av. de las Américas, Guayaquil, Ecuador"
      );
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/maps/api/geocode/json")
    );
  });

  it("falls back to REST API without cityBias", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        status: "OK",
        results: [
          {
            formatted_address: "Av. General, Ecuador",
            geometry: { location: { lat: -2.2, lng: -79.9 } },
          },
        ],
      }),
    });

    const { result } = renderHook(
      () => useAddressAutocomplete({ provider: "google", mapboxToken: "google-api-key" }),
      { wrapper: makeWrapper(null) }
    );

    act(() => { result.current.onSearchChange("General"); });
    act(() => { jest.advanceTimersByTime(400); });

    await waitFor(() => {
      expect(result.current.addressOptions).toHaveLength(1);
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("address=General")
    );
  });
});

describe("reverseGeocodeMapbox", () => {

  it("returns label and coordinates on success", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        features: [{ center: [-78.5, -0.22], place_name: "Av. Test, Quito" }]
      })
    });

    const result = await reverseGeocodeMapbox(-0.22, -78.5, "pk.test");
    expect(result).toEqual({ label: "Av. Test, Quito", latitude: -0.22, longitude: -78.5 });
  });

  it("returns null when fetch is not ok", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false });
    const result = await reverseGeocodeMapbox(-0.22, -78.5, "pk.test");
    expect(result).toBeNull();
  });

  it("returns null when features array is empty", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ features: [] })
    });
    const result = await reverseGeocodeMapbox(-0.22, -78.5, "pk.test");
    expect(result).toBeNull();
  });
});

describe("reverseGeocodeGoogle", () => {
  beforeEach(() => fetchMock.mockReset());


  it("returns null when window.google is not available and no apiKey", async () => {
    const original = (global as any).google;
    delete (global as any).google;
    const result = await reverseGeocodeGoogle(-0.22, -78.5);
    expect(result).toBeNull();
    (global as any).google = original;
  });

  it("returns label and GPS coordinates via JS API when no apiKey", async () => {
    (global as any).google = {
      maps: {
        Geocoder: function () {
          return {
            geocode: (_: any, cb: any) =>
              cb(
                [{
                  formatted_address: "Av. Test, Quito",
                  geometry: {
                    location: { lat: () => -0.22, lng: () => -78.5 }
                  }
                }],
                "OK"
              )
          };
        }
      }
    };

    const result = await reverseGeocodeGoogle(-0.22, -78.5);
    expect(result).toEqual({ label: "Av. Test, Quito", latitude: -0.22, longitude: -78.5 });
    delete (global as any).google;
  });

  it("returns null when JS geocoder status is not OK and no apiKey", async () => {
    (global as any).google = {
      maps: {
        Geocoder: function () {
          return {
            geocode: (_: any, cb: any) => cb([], "ZERO_RESULTS")
          };
        }
      }
    };

    const result = await reverseGeocodeGoogle(-0.22, -78.5);
    expect(result).toBeNull();
    delete (global as any).google;
  });


  it("returns label and GPS coordinates via REST API when apiKey is provided", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        status: "OK",
        results: [{ formatted_address: "Av. Test 123, Quito, Ecuador" }]
      })
    });

    const result = await reverseGeocodeGoogle(-0.22, -78.5, "google-api-key");
    expect(result).toEqual({ label: "Av. Test 123, Quito, Ecuador", latitude: -0.22, longitude: -78.5 });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("latlng=-0.22,-78.5")
    );
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("key=google-api-key")
    );
  });

  it("falls back to JS API when REST returns non-OK status", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ status: "ZERO_RESULTS", results: [] })
    });
    (global as any).google = {
      maps: {
        Geocoder: function () {
          return {
            geocode: (_: any, cb: any) =>
              cb([{ formatted_address: "JS Fallback, Quito", geometry: { location: { lat: () => -0.22, lng: () => -78.5 } } }], "OK")
          };
        }
      }
    };

    const result = await reverseGeocodeGoogle(-0.22, -78.5, "google-api-key");
    expect(result).toEqual({ label: "JS Fallback, Quito", latitude: -0.22, longitude: -78.5 });
    delete (global as any).google;
  });

  it("falls back to JS API when REST fetch throws", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));
    (global as any).google = {
      maps: {
        Geocoder: function () {
          return {
            geocode: (_: any, cb: any) =>
              cb([{ formatted_address: "JS Fallback 2, Quito", geometry: { location: { lat: () => -0.22, lng: () => -78.5 } } }], "OK")
          };
        }
      }
    };

    const result = await reverseGeocodeGoogle(-0.22, -78.5, "google-api-key");
    expect(result).toEqual({ label: "JS Fallback 2, Quito", latitude: -0.22, longitude: -78.5 });
    delete (global as any).google;
  });

  it("returns null when REST fails and window.google is not available", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ status: "ZERO_RESULTS", results: [] })
    });
    const original = (global as any).google;
    delete (global as any).google;

    const result = await reverseGeocodeGoogle(-0.22, -78.5, "google-api-key");
    expect(result).toBeNull();
    (global as any).google = original;
  });
});
