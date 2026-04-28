import type { MapProvider } from "@sitio-publico/shared-ui";
import type { IComboboxOption } from "@interfaces/coverageForm";

export type GeolocationResult = {
  label: string;
  latitude: number;
  longitude: number;
};

export interface IUseAddressGeolocationOptions {
  mapProvider: MapProvider;
  mapToken: string;
  onSuccess: (result: GeolocationResult) => void;
  onOpen: () => void;
}

export interface IAddressAutocompleteFieldProps {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  options: IComboboxOption[];
  loadingOptions?: boolean;
  onSearchChange: (query: string) => void;
  onSelectOption: (value: string) => void;
  value?: string;
}

