import { useState } from "react";
import type { IStepperContentControls, IStepperProps } from "@shared-ui/interfaces/stepper";
import { clampStep } from "@shared-ui/helpers/stepper";
import type { ReactNode } from "react";

type ResolvedStepperStep = {
  id: string;
  label: ReactNode;
  ariaLabel?: string;
  content: ReactNode | ((controls: IStepperContentControls) => ReactNode);
};

type UseStepperParams = Pick<
  IStepperProps,
  | "activeStep"
  | "defaultStep"
  | "completed"
  | "onStepChange"
  | "allowStepNavigation"
  | "navigationMode"
  | "navigationButtons"
  | "onBack"
  | "onContinue"
> & { steps: ResolvedStepperStep[] };

export const useStepper = ({
  steps,
  activeStep,
  defaultStep = 0,
  completed = false,
  onStepChange,
  allowStepNavigation = true,
  navigationMode = "free",
  navigationButtons,
  onBack,
  onContinue
}: UseStepperParams) => {
  const lastStepIndex = steps.length - 1;
  const safeDefaultStep = clampStep(defaultStep, lastStepIndex);
  const [internalStep, setInternalStep] = useState(safeDefaultStep);

  const isControlled = activeStep !== undefined;
  const currentStep = clampStep(
    isControlled ? activeStep : internalStep,
    lastStepIndex
  );
  const visualStep = completed ? steps.length : currentStep;
  const canGoBack = !completed && currentStep > 0;
  const canContinue = !completed && currentStep < lastStepIndex;
  const canNavigateByStepClick =
    !completed && navigationMode === "free" && allowStepNavigation;

  const shouldShowBackButton =
    (navigationButtons?.back?.visible ?? false) &&
    (!(navigationButtons?.back?.hideOnFirstStep ?? true) || canGoBack);
  const shouldShowContinueButton =
    (navigationButtons?.continue?.visible ?? false) &&
    (!(navigationButtons?.continue?.hideOnLastStep ?? true) || canContinue);

  const resolvedBackLabel = navigationButtons?.back?.label ?? "Regresar";
  const resolvedContinueLabel =
    navigationButtons?.continue?.label ?? "Continuar";
  const resolvedContinueDisabled =
    navigationButtons?.continue?.disabled ?? true;
  const resolvedBackDisabled = !canGoBack;
  const resolvedContinueActionDisabled = !canContinue;
  const resolvedBackButtonProps = navigationButtons?.back?.props;
  const resolvedContinueButtonProps = navigationButtons?.continue?.props;

  const applyStepChange = (nextStep: number) => {
    const clampedNextStep = clampStep(nextStep, lastStepIndex);
    if (clampedNextStep === currentStep) return;
    if (!isControlled) {
      setInternalStep(clampedNextStep);
    }
    onStepChange?.(clampedNextStep);
  };

  const onSelectStep = (stepIndex: number) => {
    if (!canNavigateByStepClick || stepIndex === currentStep) return;
    applyStepChange(stepIndex);
  };

  const handleBack = () => {
    if (!canGoBack) return;
    const nextStep = currentStep - 1;
    applyStepChange(nextStep);
    onBack?.(nextStep);
  };

  const handleContinue = () => {
    if (!canContinue) return;
    const nextStep = currentStep + 1;
    applyStepChange(nextStep);
    onContinue?.(nextStep);
  };

  return {
    currentStep,
    visualStep,
    canGoBack,
    canContinue,
    canNavigateByStepClick,
    shouldShowBackButton,
    shouldShowContinueButton,
    resolvedBackLabel,
    resolvedContinueLabel,
    resolvedBackDisabled,
    resolvedContinueDisabled,
    resolvedContinueActionDisabled,
    resolvedBackButtonProps,
    resolvedContinueButtonProps,
    onSelectStep,
    handleBack,
    handleContinue,
    applyStepChange
  };
};
