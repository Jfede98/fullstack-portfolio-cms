import type { TypographyData } from '@interfaces/components/typography';
import type { IStreamingPlanCard } from '@sitio-publico/shared-ui';
import type { ILeadFormSelection } from "@interfaces/coverageForm";
import type { IStreamingPlanCta } from "@sitio-publico/shared-ui";

export type ILeadAwareStreamingPlanCta = IStreamingPlanCta & {
  leadFormSelection?: ILeadFormSelection;
};

export type IStreamingPlan = Omit<IStreamingPlanCard, "ctas"> & {
  ctas: ILeadAwareStreamingPlanCta[];
};

export interface IStreamingPlansProps {
  title?: TypographyData;
  subtitle?: TypographyData;
  plans: IStreamingPlan[];
}
