import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Stepper, StepperItem } from "@shared-ui/components/stepper";
import { Button } from "@shared-ui/components/button";
import type { IStepperContentControls, IStepperProps } from "@shared-ui/interfaces/stepper";
import type { ReactNode } from "react";

type TStepDef = {
  id: string;
  label: string;
  ariaLabel?: string;
  content: ReactNode | ((controls: IStepperContentControls) => ReactNode);
};

const baseSteps: TStepDef[] = [
  { id: "step-1", label: "Consulta cobertura", content: <div>Contenido paso 1</div> },
  { id: "step-2", label: "Elige tu plan", content: <div>Contenido paso 2</div> },
  { id: "step-3", label: "Deja tus datos", content: <div>Contenido paso 3</div> }
];

const renderStepper = (
  props: Partial<IStepperProps> = {},
  steps: TStepDef[] = baseSteps
) =>
  render(
    <Stepper {...props}>
      {steps.map((step) => (
        <StepperItem
          key={step.id}
          id={step.id}
          label={step.label}
          ariaLabel={step.ariaLabel}
        >
          {step.content}
        </StepperItem>
      ))}
    </Stepper>
  );

describe("Stepper", () => {
  it("renders first step content by default", () => {
    renderStepper();
    expect(screen.getByText("Contenido paso 1")).toBeDefined();
  });

  it("changes step in uncontrolled mode when user clicks another step", () => {
    renderStepper();

    fireEvent.click(screen.getByLabelText("Paso 2"));
    expect(screen.getByText("Contenido paso 2")).toBeDefined();
  });

  it("calls onStepChange when selecting a different step", () => {
    const onStepChange = vi.fn();
    renderStepper({ onStepChange });

    fireEvent.click(screen.getByLabelText("Paso 3"));
    expect(onStepChange).toHaveBeenCalledWith(2);
  });

  it("respects controlled activeStep", () => {
    const onStepChange = vi.fn();
    renderStepper({ activeStep: 1, onStepChange });

    expect(screen.getByText("Contenido paso 2")).toBeDefined();
    fireEvent.click(screen.getByLabelText("Paso 3"));
    expect(onStepChange).toHaveBeenCalledWith(2);
    expect(screen.getByText("Contenido paso 2")).toBeDefined();
  });

  it("disables navigation when allowStepNavigation is false", () => {
    const onStepChange = vi.fn();
    renderStepper({ onStepChange, allowStepNavigation: false });

    const nextStepButton = screen.getByLabelText("Paso 2");
    fireEvent.click(nextStepButton);
    expect(nextStepButton.getAttribute("disabled")).toBe("");
    expect(onStepChange).not.toHaveBeenCalled();
    expect(screen.getByText("Contenido paso 1")).toBeDefined();
  });

  it("applies custom className", () => {
    renderStepper({ className: { base: "custom-stepper" } });
    expect(screen.getByTestId("stepper").className).toContain("custom-stepper");
  });

  it("renders internal continue button and advances to next step", () => {
    renderStepper({
      navigationButtons: {
        continue: {
          visible: true,
          hideOnLastStep: true,
          disabled: false,
          label: "Continuar"
        }
      }
    });

    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByText("Contenido paso 2")).toBeDefined();
  });

  it("hides continue button on last step when configured", () => {
    renderStepper({
      activeStep: 2,
      navigationButtons: {
        continue: {
          visible: true,
          hideOnLastStep: true,
          label: "Continuar"
        }
      }
    });

    expect(screen.queryByRole("button", { name: "Continuar" })).toBeNull();
  });

  it("shows back button only when step is greater than 0", () => {
    const { rerender } = renderStepper({
      activeStep: 0,
      navigationButtons: {
        back: {
          visible: true,
          hideOnFirstStep: true,
          label: "Regresar"
        }
      }
    });
    expect(screen.queryByRole("button", { name: /Regresar/i })).toBeNull();

    rerender(
      <Stepper
        activeStep={1}
        navigationButtons={{
          back: { visible: true, hideOnFirstStep: true, label: "Regresar" }
        }}
      >
        {baseSteps.map((step) => (
          <StepperItem key={step.id} id={step.id} label={step.label}>
            {step.content}
          </StepperItem>
        ))}
      </Stepper>
    );
    expect(screen.getByRole("button", { name: /Regresar/i })).toBeDefined();
  });

  it("calls onBack and onContinue with the next step", () => {
    const onBack = vi.fn();
    const onContinue = vi.fn();
    const onStepChange = vi.fn();

    const { rerender } = renderStepper({
      activeStep: 1,
      navigationButtons: {
        back: { visible: true, hideOnFirstStep: true, label: "Regresar" },
        continue: { visible: true, hideOnLastStep: true, disabled: false, label: "Continuar" }
      },
      onBack,
      onContinue,
      onStepChange
    });

    fireEvent.click(screen.getByRole("button", { name: /Regresar/i }));
    expect(onBack).toHaveBeenCalledWith(0);
    expect(onStepChange).toHaveBeenCalledWith(0);

    rerender(
      <Stepper
        activeStep={1}
        navigationButtons={{
          back: { visible: true, hideOnFirstStep: true, label: "Regresar" },
          continue: { visible: true, hideOnLastStep: true, disabled: false, label: "Continuar" }
        }}
        onBack={onBack}
        onContinue={onContinue}
        onStepChange={onStepChange}
      >
        {baseSteps.map((step) => (
          <StepperItem key={step.id} id={step.id} label={step.label}>
            {step.content}
          </StepperItem>
        ))}
      </Stepper>
    );

    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(onContinue).toHaveBeenCalledWith(2);
    expect(onStepChange).toHaveBeenCalledWith(2);
  });

  it("does not allow click navigation in linear mode", () => {
    renderStepper({ navigationMode: "linear" });

    fireEvent.click(screen.getByLabelText("Paso 2"));
    expect(screen.getByText("Contenido paso 1")).toBeDefined();
  });

  it("allows advancing from an internal step content action", () => {
    renderStepper(
      { navigationMode: "linear", allowStepNavigation: false },
      [
        {
          id: "s1",
          label: "Paso 1",
          content: ({ nextStep }) => (
            <Button onClick={nextStep}>Avanzar interno</Button>
          )
        },
        { id: "s2", label: "Paso 2", content: <div>Contenido paso 2</div> }
      ]
    );

    fireEvent.click(screen.getByRole("button", { name: "Avanzar interno" }));
    expect(screen.getByText("Contenido paso 2")).toBeDefined();
  });

  it("renders continue button disabled by default", () => {
    renderStepper({
      navigationButtons: {
        continue: { visible: true, label: "Continuar" }
      }
    });

    const continueBtn = screen.getByRole("button", { name: "Continuar" });
    expect(continueBtn.getAttribute("disabled")).toBe("");
  });

  it("renders check icon for completed steps", () => {
    renderStepper({ activeStep: 1 });

    const completedStepButton = screen.getByLabelText("Paso 1");
    const completedIcon = completedStepButton.querySelector("svg");
    expect(completedIcon).toBeTruthy();
  });

  it("supports previousStep and goToStep from internal content controls", () => {
    renderStepper(
      { navigationMode: "linear", allowStepNavigation: false },
      [
        {
          id: "s1",
          label: "Paso 1",
          content: ({ goToStep }) => (
            <Button onClick={() => goToStep(2)}>Ir al paso 3</Button>
          )
        },
        {
          id: "s2",
          label: "Paso 2",
          content: <div>Contenido paso 2</div>
        },
        {
          id: "s3",
          label: "Paso 3",
          content: ({ previousStep }) => (
            <Button onClick={previousStep}>Volver al paso 2</Button>
          )
        }
      ]
    );

    fireEvent.click(screen.getByRole("button", { name: "Ir al paso 3" }));
    expect(screen.getByRole("button", { name: "Volver al paso 2" })).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Volver al paso 2" }));
    expect(screen.getByText("Contenido paso 2")).toBeDefined();
  });

  it("applies custom button props for navigation buttons", () => {
    renderStepper({
      activeStep: 1,
      navigationButtons: {
        back: {
          visible: true,
          hideOnFirstStep: true,
          label: "Regresar",
          props: { className: { base: "custom-back-btn" } }
        },
        continue: {
          visible: true,
          hideOnLastStep: true,
          label: "Continuar",
          disabled: false,
          props: { className: { base: "custom-continue-btn" } }
        }
      }
    });

    expect(screen.getByRole("button", { name: /Regresar/i }).className).toContain("custom-back-btn");
    expect(screen.getByRole("button", { name: "Continuar" }).className).toContain("custom-continue-btn");
  });

  it("supports simplified navigationButtons config", () => {
    renderStepper({
      activeStep: 1,
      navigationButtons: {
        back: { visible: true, hideOnFirstStep: true, label: "Atras" },
        continue: { visible: true, hideOnLastStep: true, disabled: false, label: "Siguiente" }
      }
    });

    expect(screen.getByRole("button", { name: /Atras/i })).toBeDefined();
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeDefined();
  });

  it("marks all steps as completed when completed=true", () => {
    renderStepper({ activeStep: 2, completed: true });

    const lastStepButton = screen.getByLabelText("Paso 3");
    expect(lastStepButton.querySelector("svg")).toBeTruthy();
  });
});
