import type { IAttentionCenterCard } from "@sitio-publico/shared-ui";
import type { StrapiAttentionCenterCard } from "@interfaces/components/attentionCenterCard";
import { mapUrlMedia } from "@lib/helpers/mappers/utils";
import { mapButton } from "@lib/helpers/mappers/button";

export const mapAttentionCenterCard = (data: StrapiAttentionCenterCard): IAttentionCenterCard => {
  return {
    title: data?.title ?? "",
    image: data?.image ? {
      src: mapUrlMedia(data.image) ?? "",
      alt: data.image?.alternativeText ?? data?.title ?? "Centro de atención"
    } : undefined,
    city: data?.city ?? "",
    address: data?.address ?? "",
    schedule: data?.schedule ?? "",
    latitude: parseFloat(data?.latitude ?? "0"),
    longitude: parseFloat(data?.longitude ?? "0"),
    serviceType: data?.serviceType ?? "centro_experiencia",
    services: Array.isArray(data?.services) ? data.services.map(s => s.label || s.value || s) : [],
    mapButton: mapButton(data?.mapButton) ?? { children: "Ver en mapa", color: "secondary" },
    servicesButton: mapButton(data?.servicesButton) ?? { children: "Ver servicios", color: "outline" },
    navigationButton: data?.navigationButton ? mapButton(data?.navigationButton) : undefined
  };
};