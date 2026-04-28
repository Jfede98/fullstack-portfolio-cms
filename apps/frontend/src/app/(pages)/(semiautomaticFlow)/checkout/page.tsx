import { getSemiautomaticFlow } from "@lib/api/web/flow";
import { SemiautomaticFlowStepper } from "@components/flows/semiautomatic";
import {
  StepCoverage,
  StepCoverageError,
  StepFinalData,
  StepPlans
} from "@components/flows/semiautomatic/steps.tsx";
import type {
  TStrapiCoverageError,
  TStrapiFlowSection,
  TStrapiStepSection,
  TFlowStepType
} from "@interfaces/lib/semiautomaticFlow.ts";
import type { ReactNode } from "react";

const STEP_LABELS: Record<TFlowStepType, string> = {
  "step.data": "Datos",
  "step.coverage": "Cobertura",
  "step.plans": "Planes",
  "step.final-data": "Datos finales"
};

const buildStepContent = (
  step: TStrapiStepSection
): ReactNode => {
  switch (step.__component) {
    case "step.coverage":
      return <StepCoverage {...step} />;
    case "step.plans":
      return <StepPlans {...step} />;
    case "step.final-data":
      return <StepFinalData {...step} />;
    default:
      return null;
  }
};

const isStepSection = (section: TStrapiFlowSection): section is TStrapiStepSection =>
  section.__component === "step.coverage" ||
  section.__component === "step.plans" ||
  section.__component === "step.final-data";

const isCoverageErrorSection = (
  section: TStrapiFlowSection
): section is TStrapiCoverageError =>
  section.__component === "error.semiautomatic-error";

const SemiautomaticFlowPage = async () => {
  let data = null;
  try {
    data = await getSemiautomaticFlow();
  } catch (e) {
    console.error("[SemiautomaticFlowPage] Error fetching data:", e);
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">No se encontró el flujo semiautomático.</p>
      </div>
    );
  }

  const coverageErrorSection = (data.section ?? []).find(isCoverageErrorSection);
  const steps = (data.section ?? []).filter(isStepSection).map((step) => {
    return {
      id: `${step.id}-${step.__component}`,
      label: STEP_LABELS[step.__component],
      ariaLabel: STEP_LABELS[step.__component],
      stepType: step.__component,
      content: buildStepContent(step)
    };
  });

  return (
    <SemiautomaticFlowStepper
      steps={steps}
      coverageOkMessage={data.coverageOkMessage}
      coverageErrorContent={
        coverageErrorSection ? <StepCoverageError {...coverageErrorSection} /> : undefined
      }
    />
  );
};

export default SemiautomaticFlowPage;
