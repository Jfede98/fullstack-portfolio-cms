"use client";

import { useContext, type FC, type ReactNode } from "react";
import { CityMapProvider } from "@components/providers/cityMap";
import { SemiautomaticFlowContext } from "@context/semiautomaticFlow";

export const CityMapBridge: FC<{ children: ReactNode }> = ({ children }) => {
  const { onAddressChange } = useContext(SemiautomaticFlowContext);

  return (
    <CityMapProvider onAddressChange={onAddressChange}>
      {children}
    </CityMapProvider>
  );
};

