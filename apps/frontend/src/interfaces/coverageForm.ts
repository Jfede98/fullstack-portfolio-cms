import { FormContactInputType } from "@lib/constants/state";
import type { IIconProps } from "@sitio-publico/shared-ui";
import type { IPlanTab } from "./components/planTab";
import { ReactNode } from "react";

type TName = FormContactInputType | string;

export interface IComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ICoverageFormIcon {
  id?: number;
  name: TName;
  type?: string;
  size?: string;
}

export interface ICoverageFormInput {
  id?: number;
  label: string;
  placeholder: string;
  name: TName;
  type: string;
  maxLength?: number;
  icon?: IIconProps;
  searchable?: boolean;
  optionsApi?: "cities" | "addresses";
  options?: IComboboxOption[];
  optionsSource?: "static" | "api";
  required?: boolean;
  column?: "default" | "left" | "right" | "full";
}

export interface ICoverageFormButton {
  id?: number;
  children: ReactNode;
  href?: string;
  isExternalHref?: boolean;
  type?: "button" | "link" | "submit";
  target?: "_blank" | "_self" | "_parent" | "_top";
  color: "primary" | "secondary" | "tertiary";
  hasIcon?: boolean;
  identifier?: number;
  leadFormSelection?: ILeadFormSelection;
}

export interface ILeadFormSelection {
  leadFormDocumentId?: string;
  leadFormName?: string;
  channel?: string;
  variant?: "default" | "DSA";
  automaticFlow?: boolean;
  form?: ICoverageFormProps;
  routingConfigDocumentId?: string;
  distributionMode?: "email" | "tom" | "both";
}

export interface IPrivacyCheckbox {
  id?: number;
  label: string;
  name: string;
  required?: boolean;
}

export interface IStatusMessage {
  id?: number;
  title: string;
  description: string;
  buttonLabel: string;
  type: "success" | "error" | "duplicated";
}

export interface ICoverageFormProps {
  id?: number;
  isBlock?: boolean;
  title: string;
  description: string;
  icon?: IIconProps | null;
  inputs: ICoverageFormInput[];
  button?: ICoverageFormButton;
  privacyCheckbox?: IPrivacyCheckbox;
  statusMessage?: IStatusMessage[];
  showBorderLine?: boolean;
  mobileAfterInputsContent?: ReactNode;
  showSelectedPlanInline?: boolean;
  selectedPlanTitle?: string;
  selectedPlanActionLabel?: string;
  changePlanTabData?: IPlanTab;
  variant?:
    | "default"
    | "modal"
    | "horizontal"
    | "semiautomatic-error"
    | "semiautomatic-flow"
    | "semiautomatic-data"
    | "dsa";
  section?: "banner-header" | "banner-body";
}

export type IContactFormBlockProps = ICoverageFormProps & {
  leadSelection?: ILeadFormSelection;
};
