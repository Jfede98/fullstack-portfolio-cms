export type MapProvider = "mapbox" | "google";

export interface IMapMarker {
  longitude: number;
  latitude: number;
  title?: string;
  address?: string;
  navigationButton?: any;
  color?: string;
}

export interface IMapComponentProps {
  provider?: MapProvider;
  token?: string;
  longitude?: number;
  latitude?: number;
  zoom?: number;
  cityName?: string | null;
  mapStyle?: string;
  markers?: IMapMarker[];
  onMapClick?: (coords: { latitude: number; longitude: number }) => void;
  onMarkerDragEnd?: (coords: { latitude: number; longitude: number; markerIndex: number }) => void;
  className?: string;
  onMarkerClick?: (marker: IMapMarker, index: number) => void;
}

export interface IMapComponentClassName {
  wrapper?: string;
}
