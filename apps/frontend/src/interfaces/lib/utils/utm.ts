import { AssistedLeadSource } from "../fetch/assistedLead";

type AdditionalParams = {
  key: string;
  value: string;
};

type LinkUtms = {
  url?: string;
  preOrigin?: string;
  origin?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  tsource?: string;
  additionalParams?: AdditionalParams[];
};

type QueryParamValue = string | string[];

export interface TQueryParams {
  [key: string]: QueryParamValue;
}

export type TGetQueryParams = (url: string) => TQueryParams;
export type TGenerateLinksUtms = (req: LinkUtms) => string;
export type TGetUtmSource = () => AssistedLeadSource;
