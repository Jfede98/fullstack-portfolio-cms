"use client";
import type { FC } from "react";
import type { IDualButtons } from "@interfaces/components/dualButtons";
import { DualButtons } from "@sitio-publico/shared-ui";

export const DualButtonsBlock: FC<IDualButtons> = (props) => {
  return <DualButtons {...props} />;
};