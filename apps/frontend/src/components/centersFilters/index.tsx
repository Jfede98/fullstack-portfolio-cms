"use client";
import type { FC } from "react";
import { CentersFilters as SharedCentersFilters } from "@sitio-publico/shared-ui";
import type { ICentersFiltersProps } from "@interfaces/components/centersFilters";

export const CentersFiltersBlock: FC<ICentersFiltersProps> = (props) => {
  return <SharedCentersFilters {...props} />;
};