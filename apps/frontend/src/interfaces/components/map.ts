import type { IMapComponentProps } from "@sitio-publico/shared-ui";
import type { ReactNode } from "react";
import type { IAddressCoordinates } from "@context/cityMap";

export type IMapBlock = Pick<IMapComponentProps, "provider" | "token">;

export type StrapiMapBlock = {
  provider: string;
  token: string;
};

export interface ICityMapProviderProps {
  children: ReactNode;
  onAddressChange?: (address: IAddressCoordinates | null) => void;
}

