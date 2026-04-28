import type { IButtonProps } from "@shared-ui/interfaces/button";

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

export interface IAttentionCenterCardClassName {
  card?: string;
  imageWrapper?: string;
  image?: string;
  content?: string;
  title?: string;
  infoContainer?: string;
  addressContainer?: string;
  scheduleContainer?: string;
  infoText?: string;
  iconWrapper?: string;
  buttons?: string;
  mapButton?: string;
  servicesButton?: string;
}

export interface IAttentionCenterCardProps extends IAttentionCenterCard {
  className?: IAttentionCenterCardClassName;
}