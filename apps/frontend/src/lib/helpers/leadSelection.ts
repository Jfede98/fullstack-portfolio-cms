import type { ILeadFormSelection } from "@interfaces/coverageForm";
import { getLeadFormSelectionByDocumentId } from "@lib/api/web/leadDistribution";

export const hasRenderableInputs = (
  selection?: ILeadFormSelection
): boolean => {
  const inputs = selection?.form?.inputs;
  if (!inputs?.length) return false;

  return inputs.some((input) => Boolean(input?.name && input?.type));
};

export const hasRequiredRoutingData = (
  selection?: ILeadFormSelection
): boolean =>
  Boolean(
    selection?.channel &&
      selection?.distributionMode &&
      selection?.routingConfigDocumentId
  );

const hasStaticComboboxWithMissingOptions = (
  selection?: ILeadFormSelection
): boolean =>
  (selection?.form?.inputs ?? []).some(
    (input) =>
      input?.type === "combobox" &&
      input?.optionsSource !== "api" &&
      !input?.options?.length
  );

const needsHydration = (selection?: ILeadFormSelection): boolean => {
  if (!selection?.leadFormDocumentId) return false;

  return (
    !hasRenderableInputs(selection) ||
    !hasRequiredRoutingData(selection) ||
    hasStaticComboboxWithMissingOptions(selection)
  );
};

export const resolveLeadSelection = async (
  selection?: ILeadFormSelection
): Promise<ILeadFormSelection | undefined> => {
  if (!needsHydration(selection)) return selection;
  const leadFormDocumentId = selection?.leadFormDocumentId;
  if (!leadFormDocumentId) return selection;

  const hydrated = await getLeadFormSelectionByDocumentId(leadFormDocumentId);

  if (!hydrated) return selection;

  return {
    leadFormDocumentId:
      hydrated.leadFormDocumentId ?? selection?.leadFormDocumentId,
    leadFormName: hydrated.leadFormName ?? selection?.leadFormName,
    variant: hydrated.variant ?? selection?.variant,
    form:
      hydrated.form ??
      (selection?.form
        ? {
            ...selection.form,
            variant:
              (hydrated.variant === "DSA" ? "dsa" : undefined) ??
              selection.form.variant
          }
        : undefined),
    channel: hydrated.channel ?? selection?.channel,
    routingConfigDocumentId:
      hydrated.routingConfigDocumentId ?? selection?.routingConfigDocumentId,
    distributionMode:
      hydrated.distributionMode ?? selection?.distributionMode
  };
};
