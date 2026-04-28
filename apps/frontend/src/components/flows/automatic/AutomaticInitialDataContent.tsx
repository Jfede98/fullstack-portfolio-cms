"use client";

import { useEffect, type FC } from "react";
import { useSelector } from "react-redux";
import { FormBlock } from "@components/forms/contact/block";
import type { IPlanTab } from "@interfaces/components/planTab";
import type { IContactFormBlockProps } from "@interfaces/coverageForm";
import type { RootState } from "@store/semiautomaticFlow";
import { useAppDispatch } from "@store/semiautomaticFlow/hooks";
import { setSelectedPlan } from "@store/semiautomaticFlow";

type AutomaticInitialDataContentProps = {
  formProps: IContactFormBlockProps;
  planTabData?: IPlanTab;
  selectedPlanTitle?: string;
  selectedPlanActionLabel?: string;
};

export const AutomaticInitialDataContent: FC<AutomaticInitialDataContentProps> = ({
  formProps,
  planTabData,
  selectedPlanTitle = "PLAN SELECCIONADO:",
  selectedPlanActionLabel = "CAMBIAR PLAN"
}) => {
  const dispatch = useAppDispatch();
  const selectedPlan = useSelector(
    (state: RootState) => state.semiautomaticFlow.selectedPlan
  );

  useEffect(() => {
    if (selectedPlan) return;
    const firstPlan = planTabData?.categories?.find((category) => category.plans?.length)
      ?.plans?.[0];
    if (!firstPlan) return;
    dispatch(setSelectedPlan(firstPlan));
  }, [dispatch, planTabData, selectedPlan]);

  return (
    <div className="mx-auto flex w-full max-w-[360px] flex-col items-start gap-4 lg:max-w-[561px]">
      <FormBlock
        {...formProps}
        variant="semiautomatic-data"
        showBorderLine={false}
        showSelectedPlanInline
        selectedPlanTitle={selectedPlanTitle}
        selectedPlanActionLabel={selectedPlanActionLabel}
        changePlanTabData={planTabData}
      />
    </div>
  );
};
