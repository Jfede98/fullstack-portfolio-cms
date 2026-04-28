import type { 
  ICentersFilters, 
  StrapiCentersFilters 
} from "@interfaces/components/centersFilters";

export const mapCentersFilters = (data: StrapiCentersFilters): ICentersFilters => {
  return {
    title: data?.title ?? "",
    subtitle: data?.subtitle ?? undefined,
    searchLabel: data?.searchLabel ?? "¿Qué desea buscar?",
    centerTypeLabel: data?.centerTypeLabel ?? "Centros de Experiencia",
    kioskTypeLabel: data?.kioskTypeLabel ?? "Kioscos",
    cityDropdownLabel: data?.cityDropdownLabel ?? "Seleccionar ciudad",
    serviceDropdownLabel: data?.serviceDropdownLabel ?? "Seleccionar servicio",
    cities: Array.isArray(data?.cities) ? data.cities : [],
    services: Array.isArray(data?.services) ? data.services : []
  };
};