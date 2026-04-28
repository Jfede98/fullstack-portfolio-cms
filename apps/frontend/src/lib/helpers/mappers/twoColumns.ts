import type { ITwoColumnsBlockProps } from "@interfaces/components/twoColumns";
import type { TwoColumnsBackground } from "@shared-ui/interfaces/twoColumns";
import {
  normalizeTwoColumnsWidth,
  sanitizeHexColor
} from "@shared-ui/helpers/twoColumns";
import type { TWidget } from "@interfaces/lib/strapi/modules";
import type { StrapiLeadForm } from "@interfaces/lib/strapi/strapi";
import { createElement } from "react";
import { Widget } from "@components/widget";
import { FormBlock } from "@components/forms/contact/block";
import { mapperForm } from "./form";
import type { ILeadFormSelection } from "@interfaces/coverageForm";
import { selectCurrentRoutingConfig } from "@lib/helpers/routingConfig";
import type { ICoverageFormProps } from "@interfaces/coverageForm";

type StrapiTwoColumns = {
  leftContentType?: StrapiTwoColumnRule | null;
  rightContentType?: StrapiTwoColumnRule | null;
  backgroundVariant?: string | null;
  showDivider?: boolean | null;
  dividerColor?: string | null;
  leftWidget?: TWidget | null;
  rightWidget?: TWidget | null;
  leftWidth?: string | null;
  rightWidth?: string | null;
};

type StrapiTwoColumnRule = {
  chooseContent?: "widget" | "lead_form" | null;
  widget?: TWidget | null;
  lead_form?: StrapiLeadForm | null;
  width?: string | null;
};

const mapBackground = (
  background?: string | null
): TwoColumnsBackground | undefined =>
  background === "white" || background === "primary-50"
    ? background
    : undefined;

const mapLeadSelection = (
  leadForm?: StrapiLeadForm | null
): ILeadFormSelection | undefined => {
  if (!leadForm?.documentId) return undefined;

  //TODO: Revisar todos los activerRoutingConfig
  const activeRoutingConfig = selectCurrentRoutingConfig(
    leadForm.lead_routing_configs
  );

  return {
    leadFormDocumentId: leadForm.documentId,
    leadFormName: leadForm.name,
    channel: leadForm.channel,
    automaticFlow: leadForm.automaticFlow ?? false,
    form: leadForm.form ? mapperForm(leadForm.form) : undefined,
    routingConfigDocumentId: activeRoutingConfig?.documentId,
    distributionMode: activeRoutingConfig?.distributionMode
  };
};

const mapRuleContent = (
  rule?: StrapiTwoColumnRule | null,
  fallbackWidget?: TWidget | null,
  side?: "left" | "right",
  formVariant?: ICoverageFormProps["variant"],
  forceShowBorderLine?: boolean,
  showSelectedPlanInline?: boolean
) => {
  const contentType = rule?.chooseContent;
  if (contentType === "lead_form" && rule?.lead_form?.form) {
    const mappedForm = mapperForm(rule.lead_form.form);
    return createElement(FormBlock, {
      ...mappedForm,
      variant: formVariant ?? mappedForm.variant,
      showBorderLine: forceShowBorderLine ?? mappedForm.showBorderLine,
      showSelectedPlanInline: showSelectedPlanInline ?? mappedForm.showSelectedPlanInline,
      leadSelection: mapLeadSelection(rule.lead_form),
      key: `two-columns-${side ?? "column"}-lead-form-${rule.lead_form.documentId ?? "na"}`
    });
  }

  const widget =
    contentType === "widget"
      ? rule?.widget
      : (rule?.widget ?? fallbackWidget);
  if (!widget) return undefined;

  return createElement(Widget, {
    ...widget,
    key: `two-columns-${side ?? "column"}-widget-${widget.id ?? "na"}`
  });
};

export const mapTwoColumns = (
  data: StrapiTwoColumns,
  options?: {
    formVariant?: ICoverageFormProps["variant"];
    forceShowBorderLine?: boolean;
    showSelectedPlanInline?: boolean;
  }
): ITwoColumnsBlockProps => ({
  leftContent: mapRuleContent(
    data.leftContentType,
    data.leftWidget,
    "left",
    options?.formVariant,
    options?.forceShowBorderLine,
    options?.showSelectedPlanInline
  ),
  rightContent: mapRuleContent(
    data.rightContentType,
    data.rightWidget,
    "right",
    options?.formVariant,
    options?.forceShowBorderLine,
    options?.showSelectedPlanInline
  ),
  backgroundVariant: mapBackground(data?.backgroundVariant),
  showDivider: data.showDivider ?? undefined,
  dividerColor: sanitizeHexColor(data.dividerColor),
  leftWidth: normalizeTwoColumnsWidth(data.leftContentType?.width ?? data.leftWidth),
  rightWidth: normalizeTwoColumnsWidth(data.rightContentType?.width ?? data.rightWidth)
});
