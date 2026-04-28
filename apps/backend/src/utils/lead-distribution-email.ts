import type { Core } from "@strapi/strapi";

const EMAIL_SETTINGS_MODEL_UID = "api::email-setting.email-setting";

type TLeadDistributionEmailContext = {
  leadFormName?: string;
  capturedAt?: string;
  pageSlug?: string;
};

type TLeadDistributionEmailParams = {
  recipients: string[];
  leadData: Record<string, unknown>;
  templateReferenceId?: number | string;
  context?: TLeadDistributionEmailContext;
};

export type TLeadDistributionEmailResult = {
  to: string;
  status: "sent" | "failed";
  errorMessage?: string;
};

const normalizeRecipients = (recipients: string[]): string[] => {
  const unique = new Set<string>();

  recipients.forEach((rawRecipient) => {
    if (typeof rawRecipient !== "string") return;
    const recipient = rawRecipient.trim().toLowerCase();
    if (!recipient) return;
    unique.add(recipient);
  });

  return [...unique];
};

const toTemplateInputs = (lead: Record<string, unknown>) =>
  Object.entries(lead).map(([key, value]) => ({
    key,
    value:
      value == null
        ? ""
        : typeof value === "object"
          ? JSON.stringify(value)
          : String(value)
  }));

const formatCapturedAt = (rawDate?: string): string => {
  const date = rawDate ? new Date(rawDate) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;

  return new Intl.DateTimeFormat("es-EC", {
    timeZone: "America/Guayaquil",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(safeDate);
};

const getLeadDistributionTemplateId = async (
  strapi: Core.Strapi
): Promise<number | undefined> => {
  const settings = await strapi.db.query(EMAIL_SETTINGS_MODEL_UID).findOne({
    select: ["leadDistributionTemplateId"]
  });

  return settings?.leadDistributionTemplateId;
};

export const sendLeadDistributionEmail = async (
  strapi: Core.Strapi,
  params: TLeadDistributionEmailParams
): Promise<TLeadDistributionEmailResult[]> => {
  const recipients = normalizeRecipients(params.recipients);
  if (recipients.length === 0) return [];

  const filteredLead = { ...params.leadData };
  const templateReferenceId =
    params.templateReferenceId ?? (await getLeadDistributionTemplateId(strapi));

  if (!templateReferenceId) {
    throw new Error(
      "[lead-email] No existe templateReferenceId para distribución de leads"
    );
  }

  const payload = {
    lead: filteredLead,
    inputs: toTemplateInputs(filteredLead),
    leadFormName: params.context?.leadFormName ?? "",
    capturedAt: formatCapturedAt(params.context?.capturedAt),
    pageSlug: params.context?.pageSlug ?? ""
  };

  const results = await Promise.all(
    recipients.map(async (to): Promise<TLeadDistributionEmailResult> => {
      try {
        await strapi
          .plugin("email-designer-v5")
          .service("email")
          .sendTemplatedEmail({ to }, { templateReferenceId }, payload);

        return { to, status: "sent" };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        strapi.log.error(
          `[lead-email] Error enviando correo de lead a ${to}: ${errorMessage}`
        );
        return { to, status: "failed", errorMessage };
      }
    })
  );

  return results;
};
