import type { TextFieldStyle } from "@shared-ui/components/textField/style";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";

type TextFieldVariants = Omit<VariantProps<typeof TextFieldStyle>, "hasError">;
export interface ITextFieldClassName {
  base?: string;
  inputWrapper?: string;
  iconStyle?: string;
  wrapperLabel?: string;
  label?: string;
}

export interface IComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type NativeProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "className" | "style" | "color"
>;

export interface ITextFieldProps extends NativeProps, TextFieldVariants {
  className?: ITextFieldClassName;
  label?: string;
  error?: string;
  helperText?: string;
  showRequiredAsterisk?: boolean;
  requiredAsteriskClassName?: string;
  icon?: string;
  combobox?: boolean;
  options?: IComboboxOption[];
  onSelectOption?: (value: string) => void;
  onSearchChange?: (search: string) => void;
  searchable?: boolean;
  emptyText?: string;
  loadingOptions?: boolean;
}
