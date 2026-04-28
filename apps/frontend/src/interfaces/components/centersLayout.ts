import type { IMapComponentProps } from "@sitio-publico/shared-ui";
import type { IAttentionCenterCard } from "./attentionCenterCard";

export interface ICentersLayout {
  mapConfig: IMapComponentProps;
  centers: IAttentionCenterCard[];
  mobileMapButtonLabel: string;
  mobileListButtonLabel: string;
  onCenterMapClick?: (latitude: number, longitude: number) => void;
  onCenterServicesClick?: (services: string[]) => void;
}

export interface StrapiCentersLayout {
  mapConfig: any; // Strapi map component
  centers: any[]; // Strapi attention center cards
  mobileMapButtonLabel: string;
  mobileListButtonLabel: string;
}

export interface ICentersLayoutClassName {
  wrapper?: string;
  desktopLayout?: string;
  mapSection?: string;
  cardsSection?: string;
  mobileLayout?: string;
  mobileToggle?: string;
  mobileToggleButton?: string;
  activeMobileToggle?: string;
  mobileContent?: string;
  cardsGrid?: string;
  cardWrapper?: string;
}

export interface ICentersLayoutProps extends ICentersLayout {
  className?: ICentersLayoutClassName;
}