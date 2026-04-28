import type { TypographyData } from '@interfaces/components/typography';
import type { IButtonProps } from "@sitio-publico/shared-ui";
import type { ILeadFormSelection } from "@interfaces/coverageForm";

export type ILeadAwareButton = IButtonProps & {
  leadFormSelection?: ILeadFormSelection;
};

export interface IComparativeTableProps {
  title?: TypographyData;
  subtitle?: TypographyData;
  comparative?: IComparativeParameter[];
  sections?: IComparativeSection[];
  titleTable?: TypographyData;
}

export interface IComparativeParameter {
  label?: string;
  description?: string;
}

export interface IComparativePlan {
  price?: number;
  prevPrice?: number;
  buttons?: ILeadAwareButton[];
}

export interface IComparativeSection {
  label?: string;
  plan: IComparativePlan;
  active: boolean[];
}
