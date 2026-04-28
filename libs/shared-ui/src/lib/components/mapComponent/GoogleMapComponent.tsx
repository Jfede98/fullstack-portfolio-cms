"use client";
import { type FC, useEffect, useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import type { IMapComponentProps } from "@shared-ui/interfaces/map";
import { CentersGoogleMapVariant } from "./CentersGoogleMapVariant";

const ECUADOR_CENTER = { lat: -1.8312, lng: -78.1834 };
const ECUADOR_ZOOM = 6;

const GOOGLE_MAPS_ERROR_CODES = [
  "RefererNotAllowedMapError",
  "InvalidKeyMapError",
  "ApiNotActivatedMapError",
  "MissingKeyMapError",
  "ExpiredKeyMapError"
];

type GoogleMapInnerProps = Required<Pick<IMapComponentProps, "token">> &
  Pick<
    IMapComponentProps,
    | "longitude"
    | "latitude"
    | "zoom"
    | "markers"
    | "cityName"
    | "onMapClick"
    | "onMarkerDragEnd"
  >;

const buildErrorInfo = (
  msg: string,
  origin: string
): { title: string; detail: string; hint: string } => {
  if (msg.includes("RefererNotAllowedMapError")) {
    return {
      title: "Dominio no autorizado en la API Key",
      detail: `El origen "${origin}" no está en la lista blanca de tu API Key.`,
      hint: `Google Cloud Console → Credenciales → tu API Key → Restricciones de aplicación → Referentes HTTP → agrega: ${origin}/*`
    };
  }
  if (
    msg.includes("InvalidKeyMapError") ||
    msg.includes("MissingKeyMapError") ||
    msg.includes("ExpiredKeyMapError")
  ) {
    return {
      title: "API Key inválida, vacía o expirada",
      detail: msg,
      hint: "Verifica que el valor de googleToken sea correcto y no esté expirado."
    };
  }
  if (msg.includes("ApiNotActivatedMapError")) {
    return {
      title: "Maps JavaScript API no habilitada",
      detail: msg,
      hint: "Google Cloud Console → APIs y servicios → Habilitar APIs → busca 'Maps JavaScript API' y actívala."
    };
  }
  return {
    title: "Error de Google Maps",
    detail: msg,
    hint: "Revisa la consola del navegador para más detalles."
  };
};

/**
 * Detects if we're in a centers page context by checking if we're inside a centers page block
 */
const detectCentersContext = (): boolean => {
  // Check if we're inside a centers page block by looking for the data attribute
  const centersBlock = document.querySelector(
    '[data-block-type="centers-page-block"]'
  );
  if (centersBlock) {
    // Check if the current map container is inside this centers block
    const mapContainer = document.querySelector("[data-map-container]");
    if (mapContainer && centersBlock.contains(mapContainer)) {
      return true;
    }
  }

  return false;
};

export const GoogleMapInner: FC<GoogleMapInnerProps> = (props) => {
  const [isCentersContext, setIsCentersContext] = useState(false);
  const [gMapError, setGMapError] = useState<string | null>(null);
  const gMapRef = useRef<google.maps.Map | null>(null);
  const gMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: props.token,
    id: "google-map-script",
    libraries: ["places"]
  });

  // For non-centers context, use the new drag-enabled implementation
  const hasCenter =
    props.longitude !== undefined && props.latitude !== undefined;
  const center = hasCenter
    ? { lat: props.latitude!, lng: props.longitude! }
    : ECUADOR_CENTER;
  const zoomLevel = hasCenter ? (props.zoom ?? 12) : ECUADOR_ZOOM;

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      gMapRef.current = map;
      if (!hasCenter && (props.markers || []).length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        (props.markers || []).forEach((m) =>
          bounds.extend({ lat: m.latitude, lng: m.longitude })
        );
        map.fitBounds(bounds, 80);
      }
    },
    [hasCenter, props.markers]
  );

  useEffect(() => {
    // Detect context on mount and when DOM changes
    const checkContext = () => {
      setIsCentersContext(detectCentersContext());
    };

    checkContext();

    // Also check when DOM mutations occur (in case the data-map-container is added later)
    const observer = new MutationObserver(checkContext);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-map-container"]
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!props.cityName || !isLoaded || !gMapRef.current) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: props.cityName }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        gMapRef.current!.panTo(location);
        gMapRef.current!.fitBounds(results[0].geometry.viewport);
      }
    });
  }, [props.cityName, isLoaded]);

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
    if (!loadError) return;
    //TODO: @julian: Revisar esto porfa
    setGMapError(loadError.message);
  }, [isLoaded, loadError]);

  useEffect(() => {
    let isCancelled = false;

    const mountMarkers = async () => {
      if (!isLoaded || !gMapRef.current || isCentersContext) return; // Skip for centers context
      gMarkersRef.current.forEach((marker) => {
        marker.map = null;
      });
      gMarkersRef.current = [];

      if (props.onMarkerDragEnd) return;

      const markerLib = (await window.google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;
      if (isCancelled || !gMapRef.current) return;

      gMarkersRef.current = (props.markers || []).map((marker) => {
        const pin = marker.color
          ? new markerLib.PinElement({
              background: marker.color,
              borderColor: "#ffffff",
              glyphColor: "#ffffff"
            })
          : undefined;

        return new markerLib.AdvancedMarkerElement({
          map: gMapRef.current!,
          position: { lat: marker.latitude, lng: marker.longitude },
          title: marker.title,
          content: pin?.element
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
  }, [isLoaded, props.markers, props.onMarkerDragEnd, isCentersContext]);

  useEffect(() => {
    if (!hasCenter || !gMapRef.current) return;
    gMapRef.current.panTo({ lat: props.latitude!, lng: props.longitude! });
    gMapRef.current.setZoom(props.zoom ?? 12);
  }, [props.latitude, props.longitude, props.zoom, hasCenter]);

  // Route to appropriate variant based on context
  if (isCentersContext) {
    return <CentersGoogleMapVariant {...props} />;
  }

  const activeError = gMapError ?? loadError?.message ?? null;
  if (activeError) {
    const { title, detail, hint } = buildErrorInfo(
      activeError,
      window.location.origin
    );
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-red-50 p-4 text-center">
        <span className="text-2xl">🚫</span>
        <span className="text-sm font-semibold text-red-600">{title}</span>
        <span className="text-xs break-all text-red-500">{detail}</span>
        <span className="text-xs leading-relaxed text-gray-500">{hint}</span>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <span className="text-sm text-gray-400">Cargando mapa…</span>
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
        if (!latLng || !props.onMapClick) return;
        props.onMapClick({ latitude: latLng.lat(), longitude: latLng.lng() });
      }}
    >
      {props.onMarkerDragEnd &&
        (props.markers || []).map((marker, index) => (
          <Marker
            key={`drag-marker-${index}`}
            position={{ lat: marker.latitude, lng: marker.longitude }}
            draggable
            onDragEnd={(event) => {
              const lat = event.latLng?.lat();
              const lng = event.latLng?.lng();
              if (typeof lat !== "number" || typeof lng !== "number") return;
              props.onMarkerDragEnd!({
                latitude: lat,
                longitude: lng,
                markerIndex: index
              });
            }}
          />
        ))}
    </GoogleMap>
  );
};
