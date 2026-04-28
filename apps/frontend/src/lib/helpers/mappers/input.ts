import type { StrapiInput } from "@interfaces/lib/strapi/strapi";
import type { ICoverageFormInput } from "@interfaces/coverageForm";
import { mapIcon } from "./icon";

export const mapInput = (
  data?: StrapiInput | null
): Omit<ICoverageFormInput, "name"> | undefined => {
  if (!data) return undefined;

  const isCombobox = data?.type === "combobox";

  return {
    label: data?.label ?? "",
    placeholder: data?.placeholder ?? "",
    type: data?.type ?? "text",
    maxLength: data?.maxLength ?? undefined,
    icon: mapIcon(data?.icon) ?? undefined,
    searchable: isCombobox ? (data?.searchable ?? false) : undefined,
    optionsSource: isCombobox ? (data?.optionsSource ?? "static") : undefined,
    optionsApi: isCombobox ? data?.optionsApi : undefined,
    required: data?.required ?? false,
    column: data?.column ?? "default",
    options: isCombobox
      ? (data?.options ?? []).map((opt) => ({
          label: opt.label,
          value: opt.value,
          disabled: opt.disabled ?? false
        }))
      : undefined
  };
};
