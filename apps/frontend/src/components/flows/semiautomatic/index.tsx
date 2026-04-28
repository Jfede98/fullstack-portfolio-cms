"use client";

import { type FC, type ReactNode, useEffect, useMemo, useState } from "react";
import { Stepper, StepperItem } from "@sitio-publico/shared-ui";
import { FormContactContext } from "@context/formContact";
import { SemiautomaticFlowContext } from "@context/semiautomaticFlow";
import { useSemiautomaticFlow } from "@hooks/useSemiautomaticFlow";
import type { TFlowStepType, TStepData } from "@interfaces/lib/semiautomaticFlow.ts";
import { useAppSelector } from "@store/semiautomaticFlow/hooks";
import clsx from "clsx";

type TSemiautomaticStepperClassName = {
  header?: string;
  trail?: string;
  trailSegment?: string;
  steps?: string;
  stepItem?: string;
  stepButton?: string;
  stepNumber?: string;
  stepLabel?: string;
  backButton?: string;
};

export interface ISemiautomaticFlowStepperProps {
  steps: Array<Omit<TStepData, "stepType"> & { stepType?: TFlowStepType; content: ReactNode }>;
  coverageErrorContent?: ReactNode;
  coverageOkMessage?: string | null;
  flowSource?: "direct" | "cta";
  showMobileLabels?: boolean;
  disablePlanMode?: boolean;
  stepperClassName?: TSemiautomaticStepperClassName;
}

const PLAN_MODE_ORDER = ["step.plans", "step.coverage", "step.final-data"] as const;

const CoverageOkBanner: FC<{ message?: string | null }> = ({ message }) => {
  const text = message?.trim();
  if (!text) return null;
  return (
    <div
      className="mx-auto flex w-full max-w-[313px] items-center px-0 py-0 text-[16px] leading-6 font-bold text-[#299846] md:max-w-none md:px-0 md:py-0 md:text-xl"
      role="status"
    >
      <span>{text}</span>
    </div>
  );
};

const SemiautomaticFlowStepperInner: FC<ISemiautomaticFlowStepperProps> = ({
  steps,
  coverageErrorContent,
  coverageOkMessage,
  flowSource,
  showMobileLabels,
  disablePlanMode,
  stepperClassName
}) => {
  const selectedPlanAtMount = useAppSelector(
    (state) => state.semiautomaticFlow.selectedPlan
  );
  const coverageCompletedAtMount = useAppSelector(
    (state) => state.semiautomaticFlow.coverageCompleted
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPlanModeAtEntry, setIsPlanModeAtEntry] = useState(false);
  const [hasResolvedPlanModeAtEntry, setHasResolvedPlanModeAtEntry] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || hasResolvedPlanModeAtEntry) return;
    setIsPlanModeAtEntry(
      disablePlanMode ? false : Boolean(selectedPlanAtMount) && !coverageCompletedAtMount
    );
    setHasResolvedPlanModeAtEntry(true);
  }, [isHydrated, hasResolvedPlanModeAtEntry, selectedPlanAtMount, coverageCompletedAtMount, disablePlanMode]);

  const isPlanMode = isHydrated && isPlanModeAtEntry;
  const orderedSteps = useMemo(() => {
    if (!isPlanMode) return steps;
    return PLAN_MODE_ORDER
      .map((type) => steps.find((s) => s.stepType === type))
      .filter((s): s is typeof steps[number] => Boolean(s));
  }, [steps, isPlanMode]);

  const {
    activeStep,
    setActiveStep,
    onAddressChange,
    goToNextStep,
    selectPlan,
    coverageApiError,
    coverageApproved,
    enrichedCtx
  } = useSemiautomaticFlow(
    orderedSteps,
    isPlanMode,
    flowSource,
    hasResolvedPlanModeAtEntry
  );

  const coverageStepIdx = orderedSteps.findIndex((s) => s.stepType === "step.coverage");

  if (!orderedSteps.length) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500">No hay pasos configurados para este flujo.</p>
      </div>
    );
  }

  return (
    <SemiautomaticFlowContext.Provider value={{ onAddressChange, goToNextStep, selectPlan, isActive: true }}>
      <FormContactContext.Provider value={enrichedCtx}>
        {coverageApiError && coverageErrorContent ? (
          coverageErrorContent
        ) : (
        <Stepper
          activeStep={activeStep}
          onStepChange={setActiveStep}
          navigationMode="linear"
          allowStepNavigation={false}
          showMobileLabels={showMobileLabels}
          className={{
            header: clsx("h-6 md:h-[88px]", stepperClassName?.header),
            steps: clsx("px-[clamp(36px,25vw,360px)]", stepperClassName?.steps),
            trail: clsx(
              "left-[calc(clamp(36px,25vw,360px)+12px)] right-[calc(clamp(36px,25vw,360px)+12px)] top-3 md:left-[calc(clamp(36px,25vw,360px)+45px)] md:right-[calc(clamp(36px,25vw,360px)+45px)]",
              stepperClassName?.trail
            ),
            trailSegment: stepperClassName?.trailSegment,
            stepItem: stepperClassName?.stepItem,
            stepButton: stepperClassName?.stepButton,
            stepNumber: stepperClassName?.stepNumber,
            stepLabel: stepperClassName?.stepLabel,
            backButton: clsx(
              "text-[12px] leading-4 font-medium text-[#83378F] px-0 py-0",
              stepperClassName?.backButton
            )
          }}
          navigationButtons={{
            back: { visible: true, hideOnFirstStep: true, label: "Anterior" },
            continue: { visible: false }
          }}
        >
          {orderedSteps.map(({ id, label, ariaLabel, stepType, content }, index) => (
            <StepperItem key={id} id={id} label={label} ariaLabel={ariaLabel}>
              {coverageApproved && index === coverageStepIdx + 1 && (
                <CoverageOkBanner message={coverageOkMessage} />
              )}
              {content}
            </StepperItem>
          ))}
        </Stepper>
        )}
      </FormContactContext.Provider>
    </SemiautomaticFlowContext.Provider>
  );
};

export const SemiautomaticFlowStepper: FC<ISemiautomaticFlowStepperProps> = ({
  steps,
  coverageErrorContent,
  coverageOkMessage,
  flowSource,
  showMobileLabels,
  disablePlanMode,
  stepperClassName
}) => (
  <div className="w-full max-w-container mx-auto px-0 pt-7 md:pt-4 pb-40">
    <SemiautomaticFlowStepperInner steps={steps} coverageErrorContent={coverageErrorContent} coverageOkMessage={coverageOkMessage} flowSource={flowSource} showMobileLabels={showMobileLabels} disablePlanMode={disablePlanMode} stepperClassName={stepperClassName} />
  </div>
);
