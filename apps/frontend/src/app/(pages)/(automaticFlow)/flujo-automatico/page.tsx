import type { ReactNode } from "react";
import { getAutomaticFlow } from "@lib/api/web/flow";
import { AutomaticFlowStepper } from "@components/flows/automatic";
import { StepInitialData } from "@components/flows/automatic/StepInitialData";
import { StepCoverage } from "@components/flows/semiautomatic/steps.tsx";
import type {
  TStrapiAutomaticFlowSection,
  TStrapiAutomaticStepSection,
  TAutomaticFlowStepType
} from "@interfaces/lib/automaticFlow";
import { AUTOMATIC_STEP_LABELS } from "@interfaces/lib/automaticFlow";


const isStepSection = (
  section: TStrapiAutomaticFlowSection
): section is TStrapiAutomaticStepSection =>
  section.__component === "step.initial-data" ||
  section.__component === "step.coverage" ||
  section.__component === "step.contract" ||
  section.__component === "step.validation";


const buildStepContent = (step: TStrapiAutomaticStepSection): ReactNode => {
  switch (step.__component) {
    case "step.initial-data":
      return <StepInitialData {...step} />;
    case "step.coverage":
      return <StepCoverage {...step} layoutPreset="automatic" />;
    case "step.contract":
    case "step.validation":
    default:
      return null;
  }
};


const AutomaticFlowPage = async () => {
  let data = null;
  try {
    data = await getAutomaticFlow();
  } catch (e) {
    console.error("[AutomaticFlowPage] Error fetching data:", e);
  }

  if (!data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">No se encontró el flujo automático.</p>
      </div>
    );
  }

  const steps = (data.section ?? []).filter(isStepSection).map((step) => ({
    id: `${step.id}-${step.__component}`,
    label: AUTOMATIC_STEP_LABELS[step.__component as TAutomaticFlowStepType],
    ariaLabel: AUTOMATIC_STEP_LABELS[step.__component as TAutomaticFlowStepType],
    stepType: step.__component as TAutomaticFlowStepType,
    content: buildStepContent(step)
  }));

  return <AutomaticFlowStepper steps={steps} />;
};

export default AutomaticFlowPage;
