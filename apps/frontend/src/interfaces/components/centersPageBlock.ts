import type { IMapComponentProps } from "@sitio-publico/shared-ui";
import type { IAttentionCenterCard } from "./attentionCenterCard";

export interface ICentersPageBlock {
  title?: string;
  subtitle?: string;
  cityDropdownLabel?: string;
  serviceDropdownLabel: string;
  servicesFilterTitle?: string;
  cities: string[];
  services: string[];
  mapConfig: IMapComponentProps;
  centers: IAttentionCenterCard[];
  mobileMapButtonLabel: string;
  mobileListButtonLabel: string;
  isFirstBlock?: boolean;
}

export interface StrapiCentersPageBlock {
  title?: string;
  subtitle?: string;
  cityDropdownLabel?: string;
  serviceDropdownLabel: string;
  servicesFilterTitle?: string;
  cities: any[];
  services: any[];
  mapConfig: any;
  centers: any[];
  mobileMapButtonLabel: string;
  mobileListButtonLabel: string;
}