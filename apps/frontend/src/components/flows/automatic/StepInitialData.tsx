import type { FC } from "react";
import type { TStrapiStepInitialData } from "@interfaces/lib/automaticFlow";
import { mapPlanTab } from "@lib/helpers/mappers/planTab";
import { mapperForm } from "@lib/helpers/mappers/form";
import { selectCurrentRoutingConfig } from "@lib/helpers/routingConfig";
import type { ILeadFormSelection } from "@interfaces/coverageForm";
import { AutomaticInitialDataContent } from "./AutomaticInitialDataContent";

export const StepInitialData: FC<TStrapiStepInitialData> = async ({
  planTab,
  infoText,
  modalText,
  lead_form
}) => {
  const planTabData = planTab
    ? mapPlanTab({
        ...planTab,
        mobilePresentation: planTab.mobilePresentation ?? "accordion"
      })
    : null;

  const mappedForm = lead_form?.form ? mapperForm(lead_form.form) : null;
  const activeRoutingConfig = selectCurrentRoutingConfig(lead_form?.lead_routing_configs);
  const leadSelection: ILeadFormSelection | undefined = lead_form?.documentId
    ? {
        leadFormDocumentId: lead_form.documentId,
        leadFormName: lead_form.name,
        channel: lead_form.channel,
        variant: lead_form.variant,
        automaticFlow: lead_form.automaticFlow ?? false,
        form: mappedForm ?? undefined,
        routingConfigDocumentId: activeRoutingConfig?.documentId,
        distributionMode: activeRoutingConfig?.distributionMode
      }
    : undefined;

  if (!mappedForm) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-400">No hay formulario configurado en este paso.</p>
      </div>
    );
  }

  return (
    <AutomaticInitialDataContent
      formProps={{
        ...mappedForm,
        leadSelection
      }}
      planTabData={planTabData ?? undefined}
      selectedPlanTitle={infoText ?? "PLAN SELECCIONADO:"}
      selectedPlanActionLabel={modalText ?? "CAMBIAR PLAN"}
    />
  );
};
