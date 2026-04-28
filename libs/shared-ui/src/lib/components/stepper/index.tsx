"use client";

import { Children, isValidElement, type FC, type ReactElement } from "react";
import clsx from "clsx";
import type {
  IStepperItemProps,
  IStepperProps
} from "@shared-ui/interfaces/stepper";
import { Typography } from "@shared-ui/components/typography";
import { Button } from "@shared-ui/components/button";
import { Icon } from "@shared-ui/components/icons";
import { resolveStepStatus } from "@shared-ui/helpers/stepper";
import { useStepper } from "@shared-ui/hooks/useStepper";
import { StepperStyle, StepperStateStyle } from "./style";

const CompletedCheckIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="h-4 w-4"
  >
    <path
      d="M3 8.4L6.4 11.5L13 4.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StepperItem: FC<IStepperItemProps> = () => null;
StepperItem.displayName = "StepperItem";

const isStepperItemElement = (node: unknown): node is ReactElement<IStepperItemProps> =>
  isValidElement(node) && node.type === StepperItem;

const resolveSteps = (children: IStepperProps["children"]) =>
  Children.toArray(children)
    .filter(isStepperItemElement)
    .map((node) => ({
      id: node.props.id,
      label: node.props.label,
      ariaLabel: node.props.ariaLabel,
      content: node.props.children
    }));

export const Stepper: FC<IStepperProps> = ({
  children,
  className,
  activeStep,
  defaultStep = 0,
  completed = false,
  onStepChange,
  allowStepNavigation = true,
  showMobileLabels = false,
  navigationMode = "free",
  navigationButtons,
  onBack,
  onContinue
}) => {
  const resolvedSteps = resolveSteps(children);

  const {
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
  } = useStepper({
    steps: resolvedSteps,
    activeStep,
    defaultStep,
    completed,
    onStepChange,
    allowStepNavigation,
    navigationMode,
    navigationButtons,
    onBack,
    onContinue
  });

  const {
    base,
    header,
    trail,
    trailSegment,
    steps: stepsStyle,
    stepItem,
    stepButton,
    stepNumber,
    stepLabel,
    content,
    navigation,
    backButton,
    continueButton
  } = StepperStyle({ showMobileLabels });

  const currentStepData = resolvedSteps[currentStep];
  const activeContent = currentStepData
    ? typeof currentStepData.content === "function"
      ? currentStepData.content({
        currentStep,
        isFirstStep: !canGoBack,
        isLastStep: !canContinue,
        nextStep: handleContinue,
        previousStep: handleBack,
        goToStep: applyStepChange
      })
      : currentStepData.content
    : null;

  return (
    <section className={clsx(base(), className?.base)} data-testid="stepper">
      <div className={clsx(header(), className?.header)}>
        <div className={clsx(trail(), className?.trail)} aria-hidden="true">
          {resolvedSteps.slice(0, -1).map((step, idx) => {
            const isCompletedSegment = idx < visualStep;
            return (
              <span
                key={`${step.id}-trail`}
                className={clsx(
                  trailSegment(),
                  isCompletedSegment
                    ? "border-primary-700 border-t-2"
                    : "border-gray-300 border-t",
                  className?.trailSegment
                )}
              />
            );
          })}
        </div>

        <ol className={clsx(stepsStyle(), className?.steps)}>
          {resolvedSteps.map((step, idx) => {
            const status = resolveStepStatus(visualStep, idx);
            const isCurrent = status === "active";
            const canNavigate = canNavigateByStepClick && idx !== currentStep;
            const { stepButton: stateButton, stepNumber: stateNumber } =
              StepperStateStyle({ status, clickable: canNavigateByStepClick });

            return (
              <li key={step.id} className={clsx(stepItem(), className?.stepItem)}>
                <button
                  type="button"
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={step.ariaLabel ?? `Paso ${idx + 1}`}
                  onClick={() => onSelectStep(idx)}
                  className={clsx(stepButton(), stateButton(), className?.stepButton)}
                  disabled={!canNavigate}
                >
                  <span
                    className={clsx(stepNumber(), stateNumber(), className?.stepNumber)}
                  >
                    {status === "completed" ? (
                      <span className="text-white">
                        <CompletedCheckIcon />
                      </span>
                    ) : (
                      <Typography tag="span" variant="legal" type="bold">
                        {idx + 1}
                      </Typography>
                    )}
                  </span>
                </button>

                <Typography
                  tag="span"
                  variant="caption"
                  type="regular"
                  className={{
                    base: clsx(
                      stepLabel(),
                      status === "pending" ? "text-gray-400" : "text-primary-900",
                      className?.stepLabel
                    )
                  }}
                >
                  {step.label}
                </Typography>
              </li>
            );
          })}
        </ol>
      </div>

      {(shouldShowBackButton || shouldShowContinueButton) && (
        <div className={clsx(navigation(), className?.navigation)}>
          {shouldShowBackButton ? (
            <Button
              {...resolvedBackButtonProps}
              color={resolvedBackButtonProps?.color ?? "noBorder"}
              size={resolvedBackButtonProps?.size ?? "fit"}
              className={{
                ...resolvedBackButtonProps?.className,
                base: clsx(
                  backButton(),
                  className?.backButton,
                  resolvedBackButtonProps?.className?.base
                )
              }}
              disabled={resolvedBackDisabled}
              onClick={handleBack}
            >
              <span className="flex items-center gap-1">
                <Icon name="keyboard_arrow_left" type="filled" size="msm" color="text-primary-500" />
                {resolvedBackLabel}
              </span>
            </Button>
          ) : (
            <span />
          )}

          {shouldShowContinueButton && (
            <Button
              {...resolvedContinueButtonProps}
              color={resolvedContinueButtonProps?.color ?? "primary"}
              size={resolvedContinueButtonProps?.size ?? "fit"}
              className={{
                ...resolvedContinueButtonProps?.className,
                base: clsx(
                  continueButton(),
                  className?.continueButton,
                  resolvedContinueButtonProps?.className?.base
                )
              }}
              disabled={resolvedContinueDisabled || resolvedContinueActionDisabled}
              onClick={handleContinue}
            >
              {resolvedContinueLabel}
            </Button>
          )}
        </div>
      )}

      <div className={clsx(content(), className?.content)}>{activeContent}</div>
    </section>
  );
};
