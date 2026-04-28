import type { DropdownStyle } from "@shared-ui/components/dropdown/style";
import type { ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";

type DropdownVariants = Omit<VariantProps<typeof DropdownStyle>, "active">;


export type IDropdownClassName = {
  base?: string;
  trigger?: string;
  content?: string;
};

export interface IDropdownProps extends DropdownVariants {
  className?: IDropdownClassName;
  trigger: ReactNode;
  content?: ReactNode;
  hiddenArrowIcon?: boolean;
  onActive?: (active: boolean) => void;
  active?: boolean;
  // Multi-select props
  multiSelect?: boolean;
  selectedValues?: string[];
  onSelectionChange?: (values: string[]) => void;
  options?: string[];
  placeholder?: string;
}