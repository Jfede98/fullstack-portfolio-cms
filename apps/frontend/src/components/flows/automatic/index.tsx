"use client";

import { FormContactContext } from "@context/formContact";
import { type FC, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Stepper, StepperItem } from "@sitio-publico/shared-ui";
import type { TStepData } from "@interfaces/lib/flow";
import type { TAutomaticFlowStepType } from "@interfaces/lib/automaticFlow";

export type TAutomaticFlowStep = TStepData & {
  stepType?: TAutomaticFlowStepType;
  content: ReactNode;
};

export interface IAutomaticFlowStepperProps {
  steps: TAutomaticFlowStep[];
}

const AutomaticFlowStepperInner: FC<IAutomaticFlowStepperProps> = ({ steps }) => {
  const [activeStep, setActiveStep] = useState(0);
  const formContactCtx = useContext(FormContactContext);

  useEffect(() => {
    formContactCtx.setOnSuccessAction?.(() => {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
      return true;
    });

    return () => {
      formContactCtx.setOnSuccessAction?.(null);
    };
  }, [formContactCtx, steps.length]);

  const enrichedCtx = useMemo(
    () => ({
      ...formContactCtx,
      onSuccessAction: () => {
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
      }
    }),
    [formContactCtx, steps.length]
  );

  if (!steps.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">No hay pasos configurados para este flujo.</p>
      </div>
    );
  }

  return (
    <FormContactContext.Provider value={enrichedCtx}>
      <Stepper
        activeStep={activeStep}
        onStepChange={setActiveStep}
        navigationMode="linear"
        allowStepNavigation={false}
        showMobileLabels
        className={{
          base: "mx-auto w-full max-w-none",
          header: "mx-auto h-12 w-[360px] md:h-[88px] md:w-[743px]",
          steps: "absolute inset-x-0 top-0 justify-between gap-0 px-0 md:top-2 md:h-20",
          stepItem: "w-6 gap-2 md:w-[90px] md:gap-3",
          stepLabel:
            "block w-max min-w-0 whitespace-nowrap text-center text-[12px] leading-4 text-[#2C2C30] md:w-[90px] md:whitespace-normal md:text-[14px] md:leading-5",
          trail:
            "left-3 right-3 top-3 md:left-3 md:right-3 md:top-3",
          backButton:
            "text-[12px] leading-4 font-medium text-[#83378F] px-0 py-0"
        }}
        navigationButtons={{
          back: { visible: true, hideOnFirstStep: true, label: "Regresar" },
          continue: { visible: false }
        }}
      >
        {steps.map(({ id, label, ariaLabel, content }) => (
          <StepperItem key={id} id={id} label={label} ariaLabel={ariaLabel}>
            {content}
          </StepperItem>
        ))}
      </Stepper>
    </FormContactContext.Provider>
  );
};

export const AutomaticFlowStepper: FC<IAutomaticFlowStepperProps> = ({
  steps
}) => (
  <div className="mx-auto w-full max-w-container px-6 pt-7 pb-40 md:px-20 md:pt-4">
    <AutomaticFlowStepperInner steps={steps} />
  </div>
);
