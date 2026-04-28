import type {
  ICoverageFormProps,
  ILeadFormSelection
} from "@interfaces/coverageForm";
import { TContactFormSchema } from "@lib/schemas/contactForm";
import { IPlanCardProps } from "@sitio-publico/shared-ui";
import { FormikProps } from "formik";

export interface IFormContactContext extends FormikProps<TContactFormSchema> {
  loading: boolean;
  data?: ICoverageFormProps;
  leadSelection?: ILeadFormSelection;
  handlerData: (data: ICoverageFormProps) => void;
  setLeadSelection?: (selection?: ILeadFormSelection) => void;
  setSection?: (section: string) => void;
  statusType?: "success" | "error" | "duplicated" | null;
  setStatusType?: (status: "success" | "error" | "duplicated" | null) => void;
  setPlan?: (plan?: IPlanCardProps) => void;
  onSimpleAction?: (values: TContactFormSchema) => void | Promise<void>;
  onSuccessAction?: () => void;
  setOnSuccessAction?: (action?: (() => boolean | void) | null) => void;
  lockedFields?: string[];
}
