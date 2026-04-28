import type { StepperStatus } from "@shared-ui/interfaces/stepper";

export const clampStep = (step: number, max: number) => {
  if (max < 0) return 0;
  return Math.min(Math.max(step, 0), max);
};

export const resolveStepStatus = (
  currentStep: number,
  stepIndex: number
): StepperStatus => {
  if (stepIndex <= currentStep) {
    return stepIndex === currentStep ? "active" : "completed";
  }
  return "pending";
};
