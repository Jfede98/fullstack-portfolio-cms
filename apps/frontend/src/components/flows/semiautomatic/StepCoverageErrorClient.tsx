"use client";

import type { FC } from "react";
import type { TStrapiCoverageError } from "@interfaces/lib/semiautomaticFlow";
import type { ILeadFormSelection } from "@interfaces/coverageForm";
import { Typography } from "@sitio-publico/shared-ui";
import { mapperForm } from "@lib/helpers/mappers/form";
import { FormBlock } from "@components/forms/contact/block";

type StepCoverageErrorClientProps = {
  errorMessage?: string;
  title?: TStrapiCoverageError["title"];
  subtitle?: TStrapiCoverageError["subtitle"];
  leadForm?: TStrapiCoverageError["lead_form"];
};

const mapLeadSelection = (
  leadForm?: TStrapiCoverageError["lead_form"],
  sanitizedForm?: ReturnType<typeof mapperForm>
): ILeadFormSelection | undefined => {
  if (!leadForm?.documentId) return undefined;

  const activeRoutingConfig =
    leadForm.lead_routing_configs?.find((item) => item?.isActive !== false) ??
    leadForm.lead_routing_configs?.[0];

  return {
    leadFormDocumentId: leadForm.documentId,
    leadFormName: leadForm.name,
    channel: leadForm.channel,
    form: sanitizedForm,
    routingConfigDocumentId: activeRoutingConfig?.documentId,
    distributionMode: activeRoutingConfig?.distributionMode
  };
};

export const StepCoverageErrorClient: FC<StepCoverageErrorClientProps> = ({
  errorMessage,
  title,
  subtitle,
  leadForm
}) => {
  const mappedForm = leadForm?.form ? mapperForm(leadForm.form) : undefined;
  const resolvedTitle = title?.text?.trim() || mappedForm?.title?.trim();
  const resolvedSubtitle = subtitle?.text?.trim() || mappedForm?.description?.trim();

  const sanitizedForm = mappedForm
    ? {
        ...mappedForm,
        icon: null,
        title: "",
        description: "",
        showBorderLine: false
      }
    : undefined;

  const formProps = sanitizedForm
    ? {
        ...sanitizedForm,
        variant: "semiautomatic-error" as const,
        showBorderLine: false
      }
    : undefined;

  return (
    <section className="flex w-full flex-col items-center gap-4 py-4">
      {errorMessage?.trim() ? (
        <Typography
          tag="p"
          variant="body"
          type="bold"
          preserveLineBreaks
          className={{
            base: "w-full max-w-[313px] text-left text-red-500 md:max-w-[1280px] md:text-center md:text-[20px] md:leading-6"
          }}
        >
          {errorMessage.trim()}
        </Typography>
      ) : null}

      {resolvedTitle ? (
        <Typography
          tag={title?.tag ?? "h2"}
          variant="h3"
          type="bold"
          preserveLineBreaks
          className={{
            base: "w-full max-w-[313px] text-left text-[22px] leading-7 text-primary-500 md:max-w-[1280px] md:text-center md:text-[40px] md:leading-[48px]"
          }}
        >
          {resolvedTitle}
        </Typography>
      ) : null}

      {resolvedSubtitle ? (
        <Typography
          tag={subtitle?.tag ?? "p"}
          variant="body"
          type="regular"
          preserveLineBreaks
          className={{
            base: "w-full max-w-[313px] text-left text-[18px] leading-6 text-gray-500 md:max-w-[1280px] md:text-center md:text-[22px] md:leading-7"
          }}
        >
          {resolvedSubtitle}
        </Typography>
      ) : null}

      {formProps ? (
        <div className="w-full max-w-[313px] md:max-w-[458px]">
          <FormBlock
            {...formProps}
            leadSelection={mapLeadSelection(leadForm, sanitizedForm)}
          />
        </div>
      ) : null}
    </section>
  );
};
