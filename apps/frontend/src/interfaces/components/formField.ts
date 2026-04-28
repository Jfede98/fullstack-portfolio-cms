import type { IFormContactContext } from "@interfaces/context/formContact";
import type { ICoverageFormInput } from "@interfaces/coverageForm";

export type FormFieldProps = ICoverageFormInput &
  Pick<IFormContactContext, "getFieldProps" | "setFieldValue" | "errors" | "loading"> &
  Partial<Pick<IFormContactContext, "touched" | "submitCount">>;

