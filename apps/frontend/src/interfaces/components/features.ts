import type { TypographyData } from "./typography";
import type { ILeadFormSelection } from "@interfaces/coverageForm";

export interface IFeatureItem {
  id?: number;
  title?: string;
  description?: string;
  icon?: string;
  href?: string;
  isExternal?: boolean;
  color?: string;
  identifier?: number;
  leadFormSelection?: ILeadFormSelection;
}

export interface IFeaturesProps {
  id?: number;
  title?: TypographyData;
  layout?: "horizontal" | "vertical";
  items?: IFeatureItem[];
}
