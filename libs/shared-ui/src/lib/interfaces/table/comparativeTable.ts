import type { Screen } from "@shared-ui/constants/state";
import type { IButtonProps } from "../button";
import type { ITabProps } from "../tab";
import type { ITypographyProps } from "../typography";


export type ComparativeTableColumn = {
  label?: string;
  description?: string;
};

export type ComparativeTablePlan = {
  price?: number;
  prevPrice?: number;
  buttons?: IButtonProps[];
};

export type ComparativeTableSlide = Omit<ITabProps, "tabs" | "rounded"> & {
  plan: ComparativeTablePlan;
  active: boolean[];
  label?: string;
  comparative?: ComparativeTableColumn[];
};

export interface IComparativeTableProps {
  title?: ITypographyProps;
  subtitle?: ITypographyProps;
  comparative?: ComparativeTableColumn[];
  sections?: ComparativeTableSlide[];
  matchMediaBreakpoint?: Screen;
  titleTable?: ITypographyProps;
}
