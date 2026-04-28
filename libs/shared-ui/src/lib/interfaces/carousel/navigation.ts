import type { TArrowProps } from "@shared-ui/interfaces/carousel/arrow";
import type { IAvatarGroupProps } from "@shared-ui/interfaces/avatar/group";

type NavigationClassName = {
  base?: string;
  text?: string;
};

export interface INavigationProps {
  buttons?: TArrowProps[];
  className?: NavigationClassName;
  text?: string;
  avatarGroup?: IAvatarGroupProps;
}
