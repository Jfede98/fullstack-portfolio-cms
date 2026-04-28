"use client";
import { useCallback, useContext, useEffect, useRef, useState, type FC } from "react";
import dynamic from "next/dynamic";
import type { IMapBlock } from "@interfaces/components/map";
import { CityMapContext } from "@context/cityMap";
import { reverseGeocodeGoogle, reverseGeocodeMapbox } from "@hooks/useAddressAutocomplete";

const LazyMapComponent = dynamic(
  () => import("@sitio-publico/shared-ui").then((m) => m.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        Cargando mapa...
      </div>
    ),
  }
);

export const MapBlock: FC<IMapBlock> = ({ provider, token }) => {
  const mapWrapperRef = useRef<HTMLDivElement | null>(null);
  const pinRequestIdRef = useRef(0);
  const selectedAddressRef = useRef<{
    latitude: number;
    longitude: number;
    label: string;
  } | null>(null);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);

  const {
    selectedCity,
    selectedAddress,
    setMapConfig,
    setSelectedAddress,
    manualPinMode,
    setManualPinMode,
  } = useContext(CityMapContext);

  useEffect(() => {
    if (provider && token) {
      setMapConfig(provider, token);
    }
  }, [provider, token, setMapConfig]);

  useEffect(() => {
    selectedAddressRef.current = selectedAddress;
  }, [selectedAddress]);

  useEffect(() => {
    if (isMapVisible) return;
    const node = mapWrapperRef.current;
    if (!node || typeof window === "undefined" || typeof window.IntersectionObserver === "undefined") {
      setIsMapVisible(true);
      return;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isMapVisible]);

  useEffect(() => {
    if (manualPinMode) {
      setIsMapVisible(true);
    }
  }, [manualPinMode]);

  const applyPinnedCoordinates = useCallback(
    ({ latitude, longitude }: { latitude: number; longitude: number }) => {
      const requestId = ++pinRequestIdRef.current;

      setSelectedAddress({ latitude, longitude, label: "Ubicación seleccionada" });
      setManualPinMode(false);

      void (async () => {
        try {
          if (provider === "mapbox" && token) {
            const result = await reverseGeocodeMapbox(latitude, longitude, token);
            const latest = selectedAddressRef.current;
            if (
              result?.label &&
              requestId === pinRequestIdRef.current &&
              latest &&
              latest.latitude === latitude &&
              latest.longitude === longitude
            ) {
              setSelectedAddress({ latitude, longitude, label: result.label });
            }
          } else if (provider === "google" && token) {
            const result = await reverseGeocodeGoogle(latitude, longitude, token);
            const latest = selectedAddressRef.current;
            if (
              result?.label &&
              requestId === pinRequestIdRef.current &&
              latest &&
              latest.latitude === latitude &&
              latest.longitude === longitude
            ) {
              setSelectedAddress({ latitude, longitude, label: result.label });
            }
          }
        } catch {
        }
      })();
    },
    [provider, token, setSelectedAddress, setManualPinMode]
  );

  const handleManualMapPin = useCallback(
    ({ latitude, longitude }: { latitude: number; longitude: number }) => {
      if (!manualPinMode) return;
      applyPinnedCoordinates({ latitude, longitude });
    },
    [manualPinMode, applyPinnedCoordinates]
  );

  const handleMarkerDragEnd = useCallback(
    ({ latitude, longitude }: { latitude: number; longitude: number; markerIndex: number }) => {
      applyPinnedCoordinates({ latitude, longitude });
    },
    [applyPinnedCoordinates]
  );

  const addressMarker = selectedAddress
    ? [{
        latitude: selectedAddress.latitude,
        longitude: selectedAddress.longitude,
        title: selectedAddress.label,
        color: "#E63946"
      }]
    : [];

  return (
    <div id="address-map-selector" ref={mapWrapperRef} className="relative h-[400px] w-full">
      {manualPinMode && (
        <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-primary-700 px-4 py-2 text-xs font-medium text-white shadow-md">
          Haz clic en el mapa para fijar tu ubicación
        </div>
      )}
      {isMapVisible ? (
        <LazyMapComponent
          provider={provider}
          token={token}
          className="h-[400px] w-full"
          cityName={selectedAddress ? undefined : selectedCity}
          latitude={selectedAddress?.latitude}
          longitude={selectedAddress?.longitude}
          zoom={selectedAddress ? 18 : undefined}
          markers={addressMarker}
          onMapClick={manualPinMode ? handleManualMapPin : undefined}
          onMarkerDragEnd={selectedAddress ? handleMarkerDragEnd : undefined}
        />
      ) : (
        <div className="h-[400px] w-full rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          Cargando mapa...
        </div>
      )}
    </div>
  );
};
