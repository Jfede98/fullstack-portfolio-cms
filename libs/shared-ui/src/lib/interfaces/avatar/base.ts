import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import type { AvatarStyles } from "@shared-ui/components/avatar/base/style";

type AvatarVariants = VariantProps<typeof AvatarStyles>;

type AvatarClassName = {
  base?: string;
};

type ImgNativeProps = Omit<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  "className" | "style" | "size"
>;

export interface IAvatarProps extends ImgNativeProps, AvatarVariants {
  className?: AvatarClassName;
}
