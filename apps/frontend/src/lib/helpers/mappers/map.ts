import type { IMapBlock, StrapiMapBlock } from "@interfaces/components/map";
import type { MapProvider } from "@sitio-publico/shared-ui";

export const mapMap = (data: StrapiMapBlock): IMapBlock => {
  return {
    provider: data?.provider ? (data.provider as MapProvider) : undefined,
    token: data?.token ?? undefined
  };
};
