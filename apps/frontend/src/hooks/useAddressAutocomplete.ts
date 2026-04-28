"use client";

import { useCallback, useContext, useRef, useState, useEffect } from "react";
import { CityMapContext } from "@context/cityMap";
import type { IComboboxOption } from "@interfaces/coverageForm";

type AddressSuggestion = IComboboxOption & {
  latitude: number;
  longitude: number;
};

const DEBOUNCE_MS = 350;

async function fetchMapboxSuggestions(
  query: string,
  token: string,
  cityBias?: string
): Promise<AddressSuggestion[]> {
  void cityBias;
  const ECUADOR_BBOX = "-81.0,-5.0,-74.9,1.5";
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json` +
    `?access_token=${token}&limit=6&language=es&types=address,poi&country=ec&bbox=${ECUADOR_BBOX}`;

  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();

  return (data?.features ?? []).map((f: Record<string, unknown>) => {
    const [lng, lat] = (f.center as [number, number]) ?? [0, 0];
    const label = (f.place_name as string) ?? String(f.text);
    return { value: label, label, latitude: lat, longitude: lng };
  });
}


async function fetchGoogleSuggestionsViaJsApi(
  query: string,
  cityBias?: string | null
): Promise<AddressSuggestion[]> {
  const g = (window as any).google?.maps;
  if (!g?.places?.AutocompleteService || !g?.places?.PlacesService) return [];

  const service = new g.places.AutocompleteService();
  const placesService = new g.places.PlacesService(document.createElement("div"));
  const sessionToken = g.places.AutocompleteSessionToken
    ? new g.places.AutocompleteSessionToken()
    : undefined;

  return new Promise<AddressSuggestion[]>((resolve) => {
    service.getPlacePredictions(
      {
        input: cityBias ? `${query}, ${cityBias}` : query,
        componentRestrictions: { country: "ec" },
        ...(sessionToken ? { sessionToken } : {}),
      },
      (predictions: any[] | null, status: string) => {
        if (!predictions?.length || status !== "OK") return resolve([]);

        const tasks = predictions.slice(0, 6).map(
          (pred: any): Promise<AddressSuggestion | null> =>
            new Promise((res) => {
              placesService.getDetails(
                {
                  placeId: pred.place_id,
                  fields: ["geometry"],
                  ...(sessionToken ? { sessionToken } : {}),
                },
                (place: any, placeStatus: string) => {
                  if (placeStatus !== "OK" || !place?.geometry?.location) return res(null);
                  const lat: number = place.geometry.location.lat();
                  const lng: number = place.geometry.location.lng();
                  const label: string = pred.description;
                  res({ value: label, label, latitude: lat, longitude: lng });
                }
              );
            })
        );

        Promise.all(tasks).then((results) =>
          resolve(results.filter(Boolean) as AddressSuggestion[])
        );
      }
    );
  });
}

async function fetchGoogleSuggestionsViaRestApi(
  query: string,
  cityBias?: string | null,
  apiKey?: string
): Promise<AddressSuggestion[]> {
  if (!apiKey) return [];
  const address = cityBias ? `${query}, ${cityBias}` : query;
  const url =
    `https://maps.googleapis.com/maps/api/geocode/json` +
    `?address=${encodeURIComponent(address)}&key=${apiKey}&language=es&components=country:EC`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== "OK" || !data.results?.length) return [];
    return (data.results as any[]).slice(0, 6).map((result) => ({
      value: result.formatted_address as string,
      label: result.formatted_address as string,
      latitude: result.geometry.location.lat as number,
      longitude: result.geometry.location.lng as number,
    }));
  } catch {
    return [];
  }
}

async function fetchGoogleSuggestions(
  query: string,
  cityBias?: string | null,
  apiKey?: string
): Promise<AddressSuggestion[]> {
  if (typeof window !== "undefined" && (window as any).google?.maps?.places) {
    const results = await fetchGoogleSuggestionsViaJsApi(query, cityBias);
    if (results.length > 0) return results;
  }
  return fetchGoogleSuggestionsViaRestApi(query, cityBias, apiKey);
}

export async function reverseGeocodeGoogle(
  lat: number,
  lng: number,
  apiKey?: string
): Promise<{ label: string; latitude: number; longitude: number } | null> {
  if (apiKey) {
    try {
      const url =
        `https://maps.googleapis.com/maps/api/geocode/json` +
        `?latlng=${lat},${lng}&key=${apiKey}&language=es`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.status === "OK" && data.results?.[0]) {
          return { label: data.results[0].formatted_address as string, latitude: lat, longitude: lng };
        }
      }
    } catch {
    }
  }

  if (typeof window === "undefined" || !(window as any).google?.maps) return null;
  const geocoder = new (window as any).google.maps.Geocoder();
  return new Promise((resolve) => {
    geocoder.geocode(
      { location: { lat, lng } },
      (results: any[], status: string) => {
        if (status !== "OK" || !results?.[0]) return resolve(null);
        resolve({ label: results[0].formatted_address as string, latitude: lat, longitude: lng });
      }
    );
  });
}


export async function reverseGeocodeMapbox(
  lat: number,
  lng: number,
  token: string
): Promise<{ label: string; latitude: number; longitude: number } | null> {
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json` +
    `?access_token=${token}&limit=1&language=es&types=address,poi,place`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const feature = data?.features?.[0];
  if (!feature) return null;
  return { label: feature.place_name as string, latitude: lat, longitude: lng };
}


interface UseAddressAutocompleteOptions {
  provider: "mapbox" | "google";
  mapboxToken?: string;
}

export function useAddressAutocomplete({
  provider,
  mapboxToken,
}: UseAddressAutocompleteOptions) {
  const { selectedCity, setSelectedAddress } = useContext(CityMapContext);
  const [addressOptions, setAddressOptions] = useState<IComboboxOption[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const suggestionsRef = useRef<AddressSuggestion[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevCityRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevCityRef.current !== null && prevCityRef.current !== selectedCity) {
      setAddressOptions([]);
      suggestionsRef.current = [];
      setSelectedAddress(null);
    }
    prevCityRef.current = selectedCity;
  }, [selectedCity, setSelectedAddress]);

  const resetAddress = useCallback(() => {
    setAddressOptions([]);
    suggestionsRef.current = [];
    setSelectedAddress(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, [setSelectedAddress]);

  const onSearchChange = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!query.trim()) {
        setAddressOptions([]);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setLoadingAddresses(true);
        try {
          let suggestions: AddressSuggestion[] = [];
          if (provider === "mapbox" && mapboxToken) {
            suggestions = await fetchMapboxSuggestions(query, mapboxToken, selectedCity ?? undefined);
          } else if (provider === "google") {
            suggestions = await fetchGoogleSuggestions(query, selectedCity, mapboxToken);
          }
          suggestionsRef.current = suggestions;
          setAddressOptions(suggestions.map(({ value, label }) => ({ value, label })));
        } catch {
          setAddressOptions([]);
        } finally {
          setLoadingAddresses(false);
        }
      }, DEBOUNCE_MS);
    },
    [provider, mapboxToken, selectedCity]
  );

  const onSelectAddress = useCallback(
    (value: string) => {
      const found = suggestionsRef.current.find((s) => s.value === value);
      if (found) {
        setSelectedAddress({
          latitude: found.latitude,
          longitude: found.longitude,
          label: found.label,
        });
      }
    },
    [setSelectedAddress]
  );

  return { addressOptions, loadingAddresses, onSearchChange, onSelectAddress, resetAddress };
}
