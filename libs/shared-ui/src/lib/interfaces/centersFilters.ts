export interface ICentersFilters {
  title: string;
  subtitle?: string;
  searchLabel: string;
  centerTypeLabel: string;
  kioskTypeLabel: string;
  cityDropdownLabel: string;
  serviceDropdownLabel: string;
  cities: string[];
  services: string[];
  onServiceTypeChange?: (type: "centro_experiencia" | "kiosco") => void;
  onCityChange?: (city: string) => void;
  onServiceChange?: (service: string) => void;
}

export interface ICentersFiltersClassName {
  wrapper?: string;
  header?: string;
  title?: string;
  subtitle?: string;
  searchSection?: string;
  searchLabel?: string;
  toggleButtons?: string;
  toggleButton?: string;
  activeToggle?: string;
  filtersSection?: string;
  dropdownWrapper?: string;
}

export interface ICentersFiltersProps extends ICentersFilters {
  className?: ICentersFiltersClassName;
}