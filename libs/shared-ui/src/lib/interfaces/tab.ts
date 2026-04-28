import type { VariantProps } from "tailwind-variants";
import type { TabStyles } from "@shared-ui/components/tab/style";
import type { IIconProps } from "@shared-ui/interfaces/icons";
import type { ReactNode } from "react";

type VariantStyle = Omit<VariantProps<typeof TabStyles>, "active" | "isLargeMenu">;

type TabClassName = {
  base?: string;
  trigger?: string;
  triggerElementWrapper?: string;
  triggerLabel?: string;
  content?: string;
  wrapperContent?: string;
};

type Icon = Omit<IIconProps, "size">;

export type Tab = {
  id: string;
  icon?: Icon;
  label?: string | ReactNode;
  content: ReactNode;
};

export interface ITabProps extends VariantStyle {
  className?: TabClassName;
  tabs: Tab[];
  activeIndex?: number;
  onChange?: (index: number) => void;
}
