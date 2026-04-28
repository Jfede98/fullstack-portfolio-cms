import type { IAvatarProps } from "./base";
import type { VariantProps } from "tailwind-variants";
import type { AvatarGroupStyles } from "@shared-ui/components/avatar/group/style";

type AvatarGroupVariants = VariantProps<typeof AvatarGroupStyles>;

type AvatarGroupClassName = {
  base?: string;
  wrapper?: string;
};

type Avatars = Pick<IAvatarProps, "src"> & {
  active?: boolean;
};

export type HookAvatarGroup = Pick<IAvatarGroupProps, "avatars">;

export interface IAvatarGroupProps extends AvatarGroupVariants {
  className?: AvatarGroupClassName;
  border?: boolean;
  avatars: Avatars[];
}
