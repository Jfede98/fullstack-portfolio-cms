import type { CheckboxCustomStyle } from "@shared-ui/components/checkboxCustom/style";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";

type CheckboxCustomVariants = VariantProps<typeof CheckboxCustomStyle>;

export interface ICheckboxCustomClassName {
  base?: string;
  checkboxWrapper?: string;
  checkbox?: string;
  icon?: string;
  label?: string;
  link?: string;
  errorMessage?: string;
}

type NativeProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "className" | "type" | "name"
>;

export interface ICheckboxCustomProps extends NativeProps, CheckboxCustomVariants {
  label: string;
  name: string;
  required?: boolean;
  errorMessage?: string;
  className?: ICheckboxCustomClassName;
}
