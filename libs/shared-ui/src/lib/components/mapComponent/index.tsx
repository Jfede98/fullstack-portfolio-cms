"use client";

import { useRef, useEffect, type FC } from "react";
import Map, {
  Marker,
  NavigationControl,
  type MapRef
} from "react-map-gl/mapbox";
import type { IMapComponentProps } from "@shared-ui/interfaces/map";
import { MapComponentStyle } from "@shared-ui/components/mapComponent/style";
import { GoogleMapInner } from "@shared-ui/components/mapComponent/GoogleMapComponent";
import clsx from "clsx";
import "mapbox-gl/dist/mapbox-gl.css";

// Import the global zoom setter
declare global {
  interface Window {
    setGlobalMapZoom?: (fn: (lat: number, lng: number) => void) => void;
  }
}

const ECUADOR_BOUNDS: [number, number, number, number] = [
  -81.0, -5.0, -74.9, 1.5
];
const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/streets-v12";

type MapboxMapInnerProps = Required<Pick<IMapComponentProps, "token">> &
  Pick<
    IMapComponentProps,
    "longitude" | "latitude" | "zoom" | "cityName" | "mapStyle" | "markers" | "onMapClick" | "onMarkerClick" | "onMarkerDragEnd" | "className"
  >;

const MapboxMapInner: FC<MapboxMapInnerProps> = ({
  token,
  longitude,
  latitude,
  zoom,
  cityName,
  mapStyle = DEFAULT_MAP_STYLE,
  markers = [],
  onMapClick,
  onMarkerClick,
  onMarkerDragEnd,
  className,
}) => {
  const mapRef = useRef<MapRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isReady = useRef(false);
  const { wrapper } = MapComponentStyle();

  const hasExplicitCenter = longitude !== undefined && latitude !== undefined;

  // Geocoding for cityName
  useEffect(() => {
    if (!cityName || !token) return;
    const query = encodeURIComponent(cityName);
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&limit=1&language=es`
    )
      .then((r) => r.json())
      .then((data) => {
        const [lng, lat] = data?.features?.[0]?.center ?? [];
        if (lng !== undefined && lat !== undefined) {
          mapRef.current?.flyTo({ center: [lng, lat], zoom: 13, duration: 1200 });
        }
      })
      .catch(() => {});
  }, [cityName, token]);

  // Handle explicit coordinates
  useEffect(() => {
    if (!hasExplicitCenter) return;
    mapRef.current?.flyTo({
      center: [longitude!, latitude!],
      zoom: zoom ?? 12,
      duration: 1200
    });
  }, [longitude, latitude, zoom, hasExplicitCenter]);

  // Listen for custom zoom events
  useEffect(() => {
    const handleZoomEvent = (event: CustomEvent) => {
      const { latitude, longitude, zoom } = event.detail;
      
      const map = mapRef.current?.getMap();
      if (map) {
        map.flyTo({
          center: [longitude, latitude],
          zoom,
          duration: 1000
        });
      }
    };

    const container = containerRef.current;
    
    if (container) {
      container.addEventListener('mapZoom', handleZoomEvent as EventListener);
    }

    return () => {
      if (container) {
        container.removeEventListener('mapZoom', handleZoomEvent as EventListener);
      }
    };
  }, []);

  // Function to handle marker click and zoom
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMarkerClick = (marker: any, index: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [marker.longitude, marker.latitude],
        zoom: 16,
        duration: 1000
      });
    }
    
    if (onMarkerClick) {
      onMarkerClick(marker, index);
    }
  };

  const initialViewState = hasExplicitCenter
    ? { longitude, latitude, zoom: zoom ?? 12 }
    : markers.length > 0
      ? {
          bounds: markers.reduce<[number, number, number, number]>(
            (acc, m) => [
              Math.min(acc[0], m.longitude),
              Math.min(acc[1], m.latitude),
              Math.max(acc[2], m.longitude),
              Math.max(acc[3], m.latitude)
            ],
            [180, 90, -180, -90]
          ),
          fitBoundsOptions: { padding: 80 }
        }
      : {
          bounds: ECUADOR_BOUNDS,
          fitBoundsOptions: { padding: 40 }
        };

  return (
    <div ref={containerRef} className={clsx(wrapper(), className)} data-map-container>
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        onRender={() => {
          const map = mapRef.current?.getMap();
          
          if (map && !isReady.current) {
            isReady.current = true;
          }
        }}
        {...(onMapClick
          ? {
              onClick: (event: { lngLat: { lat: number; lng: number } }) =>
                onMapClick({
                  latitude: event.lngLat.lat,
                  longitude: event.lngLat.lng,
                }),
            }
          : {})}
      >
        <NavigationControl position="top-right" />

        {markers.map((marker, index) => (
          <Marker
            key={`marker-${index}`}
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
            draggable={!!onMarkerDragEnd}
            onDragEnd={
              onMarkerDragEnd
                ? (event: { lngLat: { lat: number; lng: number } }) =>
                    onMarkerDragEnd({
                      latitude: event.lngLat.lat,
                      longitude: event.lngLat.lng,
                      markerIndex: index,
                    })
                : undefined
            }
          >
            <div style={{ pointerEvents: "auto" }}>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMarkerClick(marker, index);
                }}
                style={{ 
                  cursor: 'pointer',
                  width: '30px',
                  height: '30px',
                  backgroundColor: marker.color ?? '#FF0000',
                  borderRadius: '50%',
                  border: 'none',
                  padding: 0,
                  pointerEvents: 'auto',
                  zIndex: 10,
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                {index + 1}
              </button>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};
export const MapComponent: FC<IMapComponentProps> = ({
  provider,
  token,
  longitude,
  latitude,
  zoom,
  cityName,
  mapStyle = DEFAULT_MAP_STYLE,
  markers = [],
  onMapClick,
  onMarkerClick,
  onMarkerDragEnd,
  className
}) => {
  const { wrapper, fallback, fallbackText } = MapComponentStyle();

  if (provider === "google") {
    if (!token) {
      return (
        <div className={clsx(wrapper(), className)}>
          <div className={fallback()}>
            <span className={fallbackText()}>
              Se requiere un token de Google Maps (<code>token</code>).
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className={clsx(wrapper(), className)} data-map-container>
        <GoogleMapInner
          token={token}
          longitude={longitude}
          latitude={latitude}
          zoom={zoom}
          cityName={cityName}
          markers={markers}
          onMapClick={onMapClick}
          onMarkerDragEnd={onMarkerDragEnd}
        />
      </div>
    );
  }

  if (provider === "mapbox") {
    if (!token) {
      return (
        <div className={clsx(wrapper(), className)}>
          <div className={fallback()}>
            <span className={fallbackText()}>
              Se requiere un token de Mapbox (<code>token</code>).
            </span>
          </div>
        </div>
      );
    }

    return (
      <MapboxMapInner
        token={token}
        longitude={longitude}
        latitude={latitude}
        zoom={zoom}
        cityName={cityName}
        mapStyle={mapStyle}
        markers={markers}
        onMapClick={onMapClick}
        onMarkerClick={onMarkerClick}
        onMarkerDragEnd={onMarkerDragEnd}
        className={className}
      />
    );
  }

  return (
    <div className={clsx(wrapper(), className)}>
      <div className={fallback()}>
        <span className={fallbackText()}>
          Proveedor de mapa "{provider}" no implementado aún.
        </span>
      </div>
    </div>
  );
};
