"use client";

import { useCallback, useState, type FC } from "react";
import { CityMapContext, type IAddressCoordinates } from "@context/cityMap";
import type { MapProvider } from "@sitio-publico/shared-ui";
import type { ICityMapProviderProps } from "@interfaces/components/map";

export const CityMapProvider: FC<ICityMapProviderProps> = ({
  children,
  onAddressChange
}) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<IAddressCoordinates | null>(null);
  const [manualPinMode, setManualPinMode] = useState(false);
  const [mapProvider, setMapProvider] = useState<MapProvider>("mapbox");
  const [mapToken, setMapToken] = useState<string>("");

  const setMapConfig = useCallback((provider: MapProvider, token: string) => {
    setMapProvider(provider);
    setMapToken(token);
  }, []);

  const handleSetSelectedAddress = useCallback(
    (address: IAddressCoordinates | null) => {
      setSelectedAddress(address);
      onAddressChange?.(address);
    },
    [onAddressChange]
  );

  return (
    <CityMapContext.Provider value={{
      selectedCity, setSelectedCity,
      selectedAddress,
      setSelectedAddress: handleSetSelectedAddress,
      manualPinMode,
      setManualPinMode,
      mapProvider, mapToken, setMapConfig
    }}>
      {children}
    </CityMapContext.Provider>
  );
};
