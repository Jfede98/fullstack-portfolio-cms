import type { IButtonProps } from "@sitio-publico/shared-ui";
import type { StrapiMedia } from "@interfaces/lib/strapi/strapi";

export type AttentionCenterServiceType = "centro_experiencia" | "isla";

export interface IAttentionCenterCard {
  title: string;
  image?: {
    src: string;
    alt?: string;
  };
  city: string;
  address: string;
  schedule: string;
  latitude: number;
  longitude: number;
  serviceType: AttentionCenterServiceType;
  services: string[];
  mapButton: IButtonProps;
  servicesButton: IButtonProps;
  navigationButton?: IButtonProps;
  onMapClick?: (latitude: number, longitude: number) => void;
  onServicesClick?: (services: string[]) => void;
}

export interface StrapiAttentionCenterCard {
  title: string;
  image?: StrapiMedia;
  city: string;
  address: string;
  schedule: string;
  latitude: string;
  longitude: string;
  serviceType: AttentionCenterServiceType;
  services: any[];
  mapButton: any;
  servicesButton: any;
  navigationButton?: any;
}

export interface IAttentionCenterCardClassName {
  card?: string;
  imageWrapper?: string;
  image?: string;
  content?: string;
  title?: string;
  addressContainer?: string;
  scheduleContainer?: string;
  infoText?: string;
  buttons?: string;
  mapButton?: string;
  servicesButton?: string;
}

export interface IAttentionCenterCardProps extends IAttentionCenterCard {
  className?: IAttentionCenterCardClassName;
}