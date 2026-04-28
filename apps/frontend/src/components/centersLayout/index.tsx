"use client";
import type { FC } from "react";
import { CentersLayout as SharedCentersLayout } from "@sitio-publico/shared-ui";
import type { ICentersLayoutProps } from "@interfaces/components/centersLayout";

export const CentersLayoutBlock: FC<ICentersLayoutProps> = (props) => {
  return <SharedCentersLayout {...props} />;
};