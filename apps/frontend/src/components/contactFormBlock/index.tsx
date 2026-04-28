"use client";

import type { FC } from "react";
import { Typography } from "@sitio-publico/shared-ui";
import type { ILeadFormConfig } from "@interfaces/components/leadDistribution";
import { FormBlock } from "@components/forms/contact/block";
import type { ILeadFormSelection } from "@interfaces/coverageForm";
import { selectCurrentRoutingConfig } from "@lib/helpers/routingConfig";

interface ContactFormBlockProps {
  title?: string;
  description?: string;
  leadForm?: ILeadFormConfig;
}

export const ContactFormBlock: FC<ContactFormBlockProps> = ({
  title,
  description,
  leadForm
}) => {
  const currentRoutingConfig = selectCurrentRoutingConfig(
    leadForm?.routingConfigs
  );

  // Crear leadSelection igual que en el Hero
  const leadSelection: ILeadFormSelection | undefined = leadForm ? {
    leadFormDocumentId: leadForm.documentId,
    leadFormName: leadForm.name,
    channel: leadForm.channel,
    variant: leadForm.variant ?? "default",
    form: leadForm.form,
    routingConfigDocumentId: currentRoutingConfig?.documentId,
    distributionMode: currentRoutingConfig?.distributionMode
  } : undefined;

  return (
    <section className="w-full py-12">
      <div className="max-w-container mx-auto px-4">
        {title && (
          <Typography
            tag="h2"
            variant="h1"
            type="regular"
            className={{ base: "text-primary-700 text-center mb-4" }}
          >
            {title}
          </Typography>
        )}

        {description && (
          <Typography
            tag="p"
            variant="body"
            type="regular"
            className={{ base: "text-gray-500 text-center mb-8" }}
          >
            {description}
          </Typography>
        )}

        {leadForm?.form && leadSelection && (
          <div className="flex justify-center">
            <FormBlock
              {...leadForm.form}
              leadSelection={leadSelection}
            />
          </div>
        )}
      </div>
    </section>
  );
};
