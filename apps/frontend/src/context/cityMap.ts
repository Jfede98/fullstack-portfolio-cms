import { createContext } from "react";
import type { MapProvider } from "@sitio-publico/shared-ui";

export interface IAddressCoordinates {
  latitude: number;
  longitude: number;
  label: string;
}

export interface ICityMapContext {
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
  selectedAddress: IAddressCoordinates | null;
  setSelectedAddress: (address: IAddressCoordinates | null) => void;
  manualPinMode: boolean;
  setManualPinMode: (active: boolean) => void;
  mapProvider: MapProvider;
  mapToken: string;
  setMapConfig: (provider: MapProvider, token: string) => void;
}

export const CityMapContext = createContext<ICityMapContext>({
  selectedCity: null,
  setSelectedCity: () => {},
  selectedAddress: null,
  setSelectedAddress: () => {},
  manualPinMode: false,
  setManualPinMode: () => {},
  mapProvider: "mapbox",
  mapToken: "",
  setMapConfig: () => {}
});
