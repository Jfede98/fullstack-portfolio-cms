import type { 
  ICentersLayout, 
  StrapiCentersLayout 
} from "@interfaces/components/centersLayout";
import { mapMap } from "@lib/helpers/mappers/map";
import { mapAttentionCenterCard } from "@lib/helpers/mappers/attentionCenterCard";

export const mapCentersLayout = (data: StrapiCentersLayout): ICentersLayout => {
  return {
    mapConfig: mapMap(data?.mapConfig),
    centers: Array.isArray(data?.centers) 
      ? data.centers.map(center => mapAttentionCenterCard(center))
      : [],
    mobileMapButtonLabel: data?.mobileMapButtonLabel ?? "Ver mapa",
    mobileListButtonLabel: data?.mobileListButtonLabel ?? "Ver listado"
  };
};