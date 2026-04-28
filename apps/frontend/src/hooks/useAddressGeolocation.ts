"use client";

import { useState, useCallback } from "react";
import { reverseGeocodeMapbox, reverseGeocodeGoogle } from "@hooks/useAddressAutocomplete.ts";
import type { GeolocationResult, IUseAddressGeolocationOptions } from "@interfaces/components/addressField.ts";

export const useAddressGeolocation = ({
  mapProvider,
  mapToken,
  onSuccess,
  onOpen,
}: IUseAddressGeolocationOptions) => {
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError("Tu navegador no soporta geolocalización.");
      return;
    }

    setLocLoading(true);
    setLocError(null);
    onOpen();

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude, longitude } = coords;
          let result: GeolocationResult | null = null;

          if (mapProvider === "mapbox" && mapToken) {
            result = await reverseGeocodeMapbox(latitude, longitude, mapToken);
          } else if (mapProvider === "google") {
            result = await reverseGeocodeGoogle(latitude, longitude, mapToken || undefined);
          }

          if (result) {
            onSuccess(result);
          } else {
            setLocError("No se pudo obtener la dirección de tu ubicación.");
          }
        } catch {
          setLocError("Error al obtener la dirección.");
        } finally {
          setLocLoading(false);
        }
      },
      (err) => {
        setLocLoading(false);
        setLocError(
          err.code === err.PERMISSION_DENIED
            ? "Permiso de ubicación denegado."
            : "No se pudo obtener tu ubicación."
        );
      },
      { timeout: 10_000, enableHighAccuracy: true }
    );
  }, [mapProvider, mapToken, onSuccess, onOpen]);

  return { locLoading, locError, handleCurrentLocation };
};


