"use client";
import type { FC } from "react";
import { AttentionCenterCard as SharedAttentionCenterCard, type IAttentionCenterCardProps } from "@sitio-publico/shared-ui";

export const AttentionCenterCardBlock: FC<IAttentionCenterCardProps> = (props) => {
  return (
    <SharedAttentionCenterCard
      {...props}
      className={{
        card: "h-full",
        ...props.className
      }}
    />
  );
};