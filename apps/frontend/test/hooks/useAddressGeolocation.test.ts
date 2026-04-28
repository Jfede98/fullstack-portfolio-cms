import { renderHook, act, waitFor } from "@testing-library/react";
import { useAddressGeolocation } from "@hooks/useAddressGeolocation";

const mockReverseGeocodeMapbox = jest.fn();
const mockReverseGeocodeGoogle = jest.fn();

jest.mock("@hooks/useAddressAutocomplete.ts", () => ({
  reverseGeocodeMapbox: (...args: any[]) => mockReverseGeocodeMapbox(...args),
  reverseGeocodeGoogle: (...args: any[]) => mockReverseGeocodeGoogle(...args)
}));

const mockGetCurrentPosition = jest.fn();
const mockGeolocation = { getCurrentPosition: mockGetCurrentPosition };

Object.defineProperty(global.navigator, "geolocation", {
  value: mockGeolocation,
  writable: true,
  configurable: true
});

describe("useAddressGeolocation", () => {
  const onSuccess = jest.fn();
  const onOpen = jest.fn();

  const defaultOptions = {
    mapProvider: "mapbox" as const,
    mapToken: "pk.test",
    onSuccess,
    onOpen
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns locLoading false and locError null by default", () => {
    const { result } = renderHook(() => useAddressGeolocation(defaultOptions));
    expect(result.current.locLoading).toBe(false);
    expect(result.current.locError).toBeNull();
  });

  it("sets locError when geolocation is not supported", () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: undefined,
      configurable: true
    });

    const { result } = renderHook(() => useAddressGeolocation(defaultOptions));
    act(() => { result.current.handleCurrentLocation(); });

    expect(result.current.locError).toBe("Tu navegador no soporta geolocalización.");
    expect(onOpen).not.toHaveBeenCalled();

    Object.defineProperty(global.navigator, "geolocation", {
      value: mockGeolocation,
      configurable: true
    });
  });

  it("calls onOpen and sets locLoading when geolocation is triggered", async () => {
    mockGetCurrentPosition.mockImplementationOnce((success: any) => {
      success({ coords: { latitude: -0.22, longitude: -78.5 } });
    });
    mockReverseGeocodeMapbox.mockResolvedValueOnce({
      label: "Av. Test", latitude: -0.22, longitude: -78.5
    });

    const { result } = renderHook(() => useAddressGeolocation(defaultOptions));
    act(() => { result.current.handleCurrentLocation(); });

    expect(onOpen).toHaveBeenCalled();

    await waitFor(() => expect(result.current.locLoading).toBe(false));
  });

  it("calls onSuccess with result from reverseGeocodeMapbox", async () => {
    const geoResult = { label: "Av. Test 123", latitude: -0.22, longitude: -78.5 };
    mockGetCurrentPosition.mockImplementationOnce((success: any) => {
      success({ coords: { latitude: -0.22, longitude: -78.5 } });
    });
    mockReverseGeocodeMapbox.mockResolvedValueOnce(geoResult);

    const { result } = renderHook(() => useAddressGeolocation(defaultOptions));
    act(() => { result.current.handleCurrentLocation(); });

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(geoResult));
    expect(result.current.locError).toBeNull();
  });

  it("calls onSuccess with result from reverseGeocodeGoogle when provider is google", async () => {
    const geoResult = { label: "Google Addr", latitude: -2.17, longitude: -79.92 };
    mockGetCurrentPosition.mockImplementationOnce((success: any) => {
      success({ coords: { latitude: -2.17, longitude: -79.92 } });
    });
    mockReverseGeocodeGoogle.mockResolvedValueOnce(geoResult);

    const { result } = renderHook(() =>
      useAddressGeolocation({ ...defaultOptions, mapProvider: "google", mapToken: "google-api-key" })
    );
    act(() => { result.current.handleCurrentLocation(); });

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(geoResult));
    expect(mockReverseGeocodeGoogle).toHaveBeenCalledWith(-2.17, -79.92, "google-api-key");
  });

  it("sets locError when reverse geocode returns null", async () => {
    mockGetCurrentPosition.mockImplementationOnce((success: any) => {
      success({ coords: { latitude: -0.22, longitude: -78.5 } });
    });
    mockReverseGeocodeMapbox.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useAddressGeolocation(defaultOptions));
    act(() => { result.current.handleCurrentLocation(); });

    await waitFor(() =>
      expect(result.current.locError).toBe("No se pudo obtener la dirección de tu ubicación.")
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("sets locError when geolocation permission is denied", async () => {
    mockGetCurrentPosition.mockImplementationOnce((_: any, error: any) => {
      error({ code: 1, PERMISSION_DENIED: 1 });
    });

    const { result } = renderHook(() => useAddressGeolocation(defaultOptions));
    act(() => { result.current.handleCurrentLocation(); });

    await waitFor(() =>
      expect(result.current.locError).toBe("Permiso de ubicación denegado.")
    );
  });

  it("sets generic locError for non-permission geolocation errors", async () => {
    mockGetCurrentPosition.mockImplementationOnce((_: any, error: any) => {
      error({ code: 2, PERMISSION_DENIED: 1 });
    });

    const { result } = renderHook(() => useAddressGeolocation(defaultOptions));
    act(() => { result.current.handleCurrentLocation(); });

    await waitFor(() =>
      expect(result.current.locError).toBe("No se pudo obtener tu ubicación.")
    );
  });
});

