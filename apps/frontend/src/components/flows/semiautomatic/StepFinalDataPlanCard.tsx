"use client";

import { useSelector } from "react-redux";
import type { FC } from "react";
import type { RootState } from "@store/semiautomaticFlow";
import { ClientPlanCard } from "@components/client/ClientPlanCard";

export const StepFinalDataPlanCard: FC = () => {
  const selectedPlan = useSelector(
    (state: RootState) => state.semiautomaticFlow.selectedPlan
  );

  if (!selectedPlan) return null;

  return (
    <ClientPlanCard
      {...selectedPlan}
      desktopPresentation="pricing"
      mobilePresentation="accordion"
    />
  );
};

