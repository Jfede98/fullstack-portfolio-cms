"use client";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  GoogleMap,
  useJsApiLoader
} from "@react-google-maps/api";
import type { IMapComponentProps } from "@shared-ui/interfaces/map";

const ECUADOR_CENTER = { lat: -1.8312, lng: -78.1834 };
const ECUADOR_ZOOM = 6;

const GOOGLE_MAPS_ERROR_CODES = [
  "RefererNotAllowedMapError",
  "InvalidKeyMapError",
  "ApiNotActivatedMapError",
  "MissingKeyMapError",
  "ExpiredKeyMapError",
];

type GoogleMapInnerProps = Required<Pick<IMapComponentProps, "token">> &
  Pick<IMapComponentProps, "longitude" | "latitude" | "zoom" | "markers" | "cityName" | "onMapClick">;

const buildErrorInfo = (msg: string, origin: string): { title: string; detail: string; hint: string } => {
  if (msg.includes("RefererNotAllowedMapError")) {
    return {
      title: "Dominio no autorizado en la API Key",
      detail: `El origen "${origin}" no está en la lista blanca de tu API Key.`,
      hint: `Google Cloud Console → Credenciales → tu API Key → Restricciones de aplicación → Referentes HTTP → agrega: ${origin}/*`,
    };
  }
  if (msg.includes("InvalidKeyMapError") || msg.includes("MissingKeyMapError") || msg.includes("ExpiredKeyMapError")) {
    return {
      title: "API Key inválida, vacía o expirada",
      detail: msg,
      hint: "Verifica que el valor de googleToken sea correcto y no esté expirado.",
    };
  }
  if (msg.includes("ApiNotActivatedMapError")) {
    return {
      title: "Maps JavaScript API no habilitada",
      detail: msg,
      hint: "Google Cloud Console → APIs y servicios → Habilitar APIs → busca 'Maps JavaScript API' y actívala.",
    };
  }
  return {
    title: "Error de Google Maps",
    detail: msg,
    hint: "Revisa la consola del navegador para más detalles.",
  };
};

export const DefaultGoogleMapVariant: FC<GoogleMapInnerProps> = ({
  token,
  longitude,
  latitude,
  zoom,
  markers = [],
  cityName,
  onMapClick,
}) => {
  const [gMapError, setGMapError] = useState<string | null>(null);
  const gMapRef = useRef<google.maps.Map | null>(null);
  const gMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: token,
    id: "google-map-script",
    libraries: ["places"],
  });

  useEffect(() => {
    if (!cityName || !isLoaded || !gMapRef.current) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: cityName }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        gMapRef.current!.panTo(location);
        gMapRef.current!.fitBounds(results[0].geometry.viewport);
      }
    });
  }, [cityName, isLoaded]);

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      const msg = event.message ?? "";
      if (GOOGLE_MAPS_ERROR_CODES.some((code) => msg.includes(code))) {
        setGMapError(msg);
      }
    };

    const handleGlobalMessage = (event: MessageEvent) => {
      const msg = typeof event.data === "string" ? event.data : "";
      if (GOOGLE_MAPS_ERROR_CODES.some((code) => msg.includes(code))) {
        setGMapError(msg);
      }
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("message", handleGlobalMessage);
    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("message", handleGlobalMessage);
    };
  }, []);

  useEffect(() => {
    if (loadError) {
      setGMapError(loadError.message);
    }
  }, [isLoaded, loadError]);

  useEffect(() => {
    let isCancelled = false;

    const mountMarkers = async () => {
      if (!isLoaded || !gMapRef.current) return;
      const markerLib = await window.google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
      if (isCancelled || !gMapRef.current) return;

      gMarkersRef.current.forEach((marker) => {
        marker.map = null;
      });

      gMarkersRef.current = markers.map((marker) => {
        const pin = marker.color
          ? new markerLib.PinElement({
              background: marker.color,
              borderColor: "#ffffff",
              glyphColor: "#ffffff",
            })
          : undefined;

        return new markerLib.AdvancedMarkerElement({
          map: gMapRef.current!,
          position: { lat: marker.latitude, lng: marker.longitude },
          title: marker.title,
          content: pin?.element,
        });
      });
    };

    void mountMarkers();

    return () => {
      isCancelled = true;
      gMarkersRef.current.forEach((marker) => {
        marker.map = null;
      });
      gMarkersRef.current = [];
    };
  }, [isLoaded, markers]);

  const hasCenter = longitude !== undefined && latitude !== undefined;
  const center = hasCenter ? { lat: latitude!, lng: longitude! } : ECUADOR_CENTER;
  const zoomLevel = hasCenter ? (zoom ?? 12) : ECUADOR_ZOOM;

  useEffect(() => {
    if (!hasCenter || !gMapRef.current) return;
    gMapRef.current.panTo({ lat: latitude!, lng: longitude! });
    gMapRef.current.setZoom(zoom ?? 12);
  }, [latitude, longitude, zoom, hasCenter]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      gMapRef.current = map;
      if (!hasCenter && markers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach((m) => bounds.extend({ lat: m.latitude, lng: m.longitude }));
        map.fitBounds(bounds, 80);
      }
    },
    [hasCenter, markers]
  );

  const activeError = gMapError ?? loadError?.message ?? null;
  if (activeError) {
    const { title, detail, hint } = buildErrorInfo(activeError, window.location.origin);
    return (
      <div className="w-full h-full bg-red-50 flex flex-col items-center justify-center gap-3 p-4 text-center">
        <span className="text-2xl">🚫</span>
        <span className="text-red-600 text-sm font-semibold">{title}</span>
        <span className="text-red-500 text-xs break-all">{detail}</span>
        <span className="text-gray-500 text-xs leading-relaxed">{hint}</span>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Cargando mapa…</span>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={zoomLevel}
      options={{ mapId: "DEMO_MAP_ID" }}
      onLoad={onLoad}
      onClick={(event) => {
        const latLng = event.latLng;
        if (!latLng || !onMapClick) return;
        onMapClick({ latitude: latLng.lat(), longitude: latLng.lng() });
      }}
    />
  );
};