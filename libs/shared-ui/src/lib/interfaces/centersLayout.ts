import type { IMapComponentProps } from "@shared-ui/interfaces/map";
import type { IAttentionCenterCard } from "@shared-ui/interfaces/cards/attentionCenter";

export interface ICentersLayout {
  mapConfig: IMapComponentProps;
  centers: IAttentionCenterCard[];
  mobileMapButtonLabel: string;
  mobileListButtonLabel: string;
  onCenterMapClick?: (latitude: number, longitude: number) => void;
  onCenterServicesClick?: (services: string[]) => void;
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