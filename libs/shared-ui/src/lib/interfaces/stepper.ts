import type { VariantProps } from "tailwind-variants";
import type { StepperStyle } from "@shared-ui/components/stepper/style";
import type { IButtonProps } from "@shared-ui/interfaces/button";
import type { ReactNode } from "react";

type StepperVariants = VariantProps<typeof StepperStyle>;

export type StepperStatus = "active" | "completed" | "pending";
export type StepperNavigationMode = "free" | "linear";
export type IStepperContentControls = {
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepIndex: number) => void;
};

export type IStepperClassName = {
  base?: string;
  header?: string;
  trail?: string;
  trailSegment?: string;
  steps?: string;
  stepItem?: string;
  stepButton?: string;
  stepNumber?: string;
  stepLabel?: string;
  content?: string;
  navigation?: string;
  backButton?: string;
  continueButton?: string;
};

export type IStepperItemProps = {
  id: string;
  label: ReactNode;
  ariaLabel?: string;
  children: ReactNode | ((controls: IStepperContentControls) => ReactNode);
};

export type IStepperBackButtonConfig = {
  visible?: boolean;
  hideOnFirstStep?: boolean;
  label?: ReactNode;
  props?: Omit<IButtonProps, "children" | "onClick">;
};

export type IStepperContinueButtonConfig = {
  visible?: boolean;
  hideOnLastStep?: boolean;
  label?: ReactNode;
  disabled?: boolean;
  props?: Omit<IButtonProps, "children" | "onClick" | "disabled">;
};

export type IStepperNavigationButtons = {
  back?: IStepperBackButtonConfig;
  continue?: IStepperContinueButtonConfig;
};

export interface IStepperProps extends StepperVariants {
  children?: ReactNode;
  className?: IStepperClassName;
  activeStep?: number;
  defaultStep?: number;
  completed?: boolean;
  onStepChange?: (stepIndex: number) => void;
  allowStepNavigation?: boolean;
  navigationMode?: StepperNavigationMode;
  navigationButtons?: IStepperNavigationButtons;
  onBack?: (nextStep: number) => void;
  onContinue?: (nextStep: number) => void;
}
