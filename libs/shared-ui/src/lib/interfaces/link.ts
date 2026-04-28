import type { ComponentType, ReactNode } from "react";

type LinkTarget = "_blank" | "_self" | "_parent" | "_top";

type ILinkClassName = {
  base?: string;
  wrapper?: string;
};

type NextNavigateEvent = {
  preventDefault: () => void;
};

type NextNativeProps = {
  href: string;
  prefetch?: boolean;
  target?: LinkTarget;
  children: ReactNode;
  as?: string;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  locale?: string | false;
  rel?: string;
  onNavigate?: (event: NextNavigateEvent) => void;
};

export type LinkProps = NextNativeProps & {
  className?: string;
};

export interface ILink extends NextNativeProps {
  component?: ComponentType<LinkProps>;
  className?: ILinkClassName;
  ariaLabel?: string;
  onClick?: () => void;
}
