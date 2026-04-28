"use client";
import { useCallback, useEffect, useState, type FC } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
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

export const CentersGoogleMapVariant: FC<GoogleMapInnerProps> = ({
  token,
  longitude,
  latitude,
  zoom,
  markers = [],
  cityName,
  // onMapClick, // Not used in this variant
}) => {
  const [gMapError, setGMapError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: token,
    id: "google-map-script",
    libraries: ["places"],
  });

  const hasCenter = longitude !== undefined && latitude !== undefined;
  const center = hasCenter ? { lat: latitude!, lng: longitude! } : ECUADOR_CENTER;
  const zoomLevel = hasCenter ? (zoom ?? 12) : ECUADOR_ZOOM;

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMapInstance(map);
      
      // Cerrar InfoWindow al hacer clic en el mapa
      map.addListener('click', () => {
        setInfoWindowOpen(false);
        setSelectedMarker(null);
      });
      
      if (!hasCenter && markers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach((m) => bounds.extend({ lat: m.latitude, lng: m.longitude }));
        map.fitBounds(bounds, 80);
      }
    },
    [hasCenter, markers]
  );

  // Función para copiar dirección al clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Dirección copiada al clipboard');
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Función para abrir InfoWindow con delay después del zoom
  const openInfoWindowAfterZoom = (marker: any) => {
    setTimeout(() => {
      setSelectedMarker(marker);
      setInfoWindowOpen(true);
    }, 500); // Delay de 500ms después del zoom
  };

  useEffect(() => {
    if (!cityName || !isLoaded || !mapInstance) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: cityName }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        mapInstance.panTo(location);
        mapInstance.fitBounds(results[0].geometry.viewport);
      }
    });
  }, [cityName, isLoaded, mapInstance]);

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
    if (!hasCenter || !mapInstance) return;
    mapInstance.panTo({ lat: latitude!, lng: longitude! });
    mapInstance.setZoom(zoom ?? 12);
  }, [latitude, longitude, zoom, hasCenter, mapInstance]);

  // Ocultar la X del InfoWindow cuando se abre
  useEffect(() => {
    if (infoWindowOpen) {
      // Agregar CSS para ocultar la X
      const style = document.createElement('style');
      style.id = 'hide-infowindow-close';
      style.textContent = `
        .gm-style-iw-chr {
          display: none !important;
        }
        .gm-style-iw-t {
          padding-top: 0 !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('hide-infowindow-close');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
    
    // Return empty cleanup function when infoWindowOpen is false
    return () => {};
  }, [infoWindowOpen]);

  // Listen for zoom events
  useEffect(() => {
    const handleZoomEvent = (event: CustomEvent) => {
      const { latitude, longitude, zoom, markerData } = event.detail;
      
      if (mapInstance) {
        mapInstance.panTo({ lat: latitude, lng: longitude });
        mapInstance.setZoom(zoom);
        
        // Solo abrir InfoWindow en desktop
        if (markerData && !markerData.isMobile) {
          openInfoWindowAfterZoom(markerData);
        }
      }
    };

    const container = document.querySelector('[data-map-container]');
    if (container) {
      container.addEventListener('mapZoom', handleZoomEvent as EventListener);
      return () => {
        container.removeEventListener('mapZoom', handleZoomEvent as EventListener);
      };
    }
    
    // Return empty cleanup function if no container found
    return () => {};
  }, [mapInstance]);

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
    >
        {markers.map((marker, index) => (
          <Marker
            key={`gmarker-${index}`}
            position={{ lat: marker.latitude, lng: marker.longitude }}
            title={marker.title}
            onClick={() => {
              if (mapInstance) {
                mapInstance.panTo({ lat: marker.latitude, lng: marker.longitude });
                mapInstance.setZoom(16);
                
                // Solo abrir InfoWindow en desktop
                const isMobile = window.innerWidth < 1024;
                if (!isMobile) {
                  openInfoWindowAfterZoom(marker);
                } else {
                  // En móvil, disparar evento para que CentersPageBlock maneje el BottomSheet
                  const mapContainer = document.querySelector('[data-map-container]');
                  if (mapContainer) {
                    const event = new CustomEvent('markerClickMobile', {
                      detail: { marker }
                    });
                    mapContainer.dispatchEvent(event);
                  }
                }
              }
            }}
            icon={
              marker.color
                ? {
                    path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
                    fillColor: marker.color,
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 1.5,
                    scale: 1,
                  }
                : undefined
            }
          />
        ))}
        
        {/* InfoWindow personalizado */}
        {infoWindowOpen && selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
            onCloseClick={() => {
              setInfoWindowOpen(false);
              setSelectedMarker(null);
            }}
            options={{
              pixelOffset: new window.google.maps.Size(0, -40),
              disableAutoPan: false,
              maxWidth: 300
            }}
          >
            <div className="p-4 bg-white rounded-lg shadow-lg border-0" style={{ borderRadius: '8px' }}>
              {/* Título */}
              <h3 className="text-lg font-bold text-[#6E3279] mb-2">
                {selectedMarker.title}
              </h3>
              
              {/* Dirección con botón copiar */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-700 text-sm flex-1">
                  {selectedMarker.address || 'Dirección no disponible'}
                </span>
                <button
                  onClick={() => copyToClipboard(selectedMarker.address || '')}
                  className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                  title="Copiar dirección"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              
              {/* Botón configurable */}
              {selectedMarker.navigationButton && (
                <button
                  onClick={() => {
                    if (selectedMarker.navigationButton.href) {
                      window.open(selectedMarker.navigationButton.href, '_blank');
                    }
                  }}
                  className={`w-full px-4 py-2 rounded-md font-medium transition-colors cursor-pointer ${
                    selectedMarker.navigationButton.color === 'primary' 
                      ? 'bg-[#6E3279] text-white hover:bg-[#5a2a63]'
                      : selectedMarker.navigationButton.color === 'secondary'
                      ? 'bg-[#FFCF00] text-black hover:bg-[#e6b800]'
                      : 'bg-[#6E3279] text-white hover:bg-[#5a2a63]'
                  }`}
                >
                  {selectedMarker.navigationButton.children || 'Ver en mapa'}
                </button>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    );
};