import type { ICentersPageBlock, StrapiCentersPageBlock } from "@interfaces/components/centersPageBlock";
import { mapMap } from "./map";
import { mapAttentionCenterCard } from "./attentionCenterCard";

export const mapCentersPageBlock = (data: StrapiCentersPageBlock): ICentersPageBlock => {
  return {
    title: data?.title ?? "",
    subtitle: data?.subtitle ?? undefined,
    cityDropdownLabel: data?.cityDropdownLabel ?? "Seleccionar ciudad",
    serviceDropdownLabel: data?.serviceDropdownLabel ?? "Seleccionar servicio",
    servicesFilterTitle: data?.servicesFilterTitle ?? "Servicios disponibles",
    cities: Array.isArray(data?.cities) ? data.cities.map(city => city.label || city.value || city) : [],
    services: Array.isArray(data?.services) ? data.services.map(service => service.label || service.value || service) : [],
    mapConfig: mapMap(data?.mapConfig),
    centers: Array.isArray(data?.centers) ? data.centers.map(center => mapAttentionCenterCard(center)) : [],
    mobileMapButtonLabel: data?.mobileMapButtonLabel ?? "Ver mapa",
    mobileListButtonLabel: data?.mobileListButtonLabel ?? "Ver listado"
  };
};