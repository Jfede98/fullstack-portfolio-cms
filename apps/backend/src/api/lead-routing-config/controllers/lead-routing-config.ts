/**
 * lead-routing-config controller
 */

import { factories } from '@strapi/strapi';
import {
  sendLeadDistributionEmail,
  type TLeadDistributionEmailResult,
} from '../../../utils/lead-distribution-email';

const MODEL_UID = 'api::lead-routing-config.lead-routing-config';

type TDispatchBody = {
  routingConfigDocumentId?: string;
  leadFormDocumentId?: string;
  pageSlug?: string;
  leadData?: Record<string, unknown>;
};

type TRoutingConfig = {
  id: number;
  documentId: string;
  name: string;
  distributionMode: 'email' | 'tom' | 'both';
  lead_form?: { name?: string } | null;
  email_lead_recipients?: { email?: string; isActive?: boolean }[];
};

const TEMPLATE_MISSING_ERROR_FRAGMENT = 'templateReferenceId';

const buildRoutingFilters = (
  routingConfigDocumentId?: string,
  leadFormDocumentId?: string
): Record<string, unknown> => {
  const filters: Record<string, unknown> = {
    isActive: { $eq: true },
    distributionMode: { $in: ['email', 'both'] },
  };

  if (routingConfigDocumentId) {
    filters.documentId = { $eq: routingConfigDocumentId };
  }

  if (leadFormDocumentId) {
    filters.lead_form = { documentId: { $eq: leadFormDocumentId } };
  }

  return filters;
};

const selectRoutingConfig = (
  configs: TRoutingConfig[],
  routingConfigDocumentId?: string
) => {
  if (routingConfigDocumentId) return configs[0];
  return configs[0];
};

const resolveRecipients = (
  recipients?: TRoutingConfig['email_lead_recipients']
): string[] =>
  (recipients ?? [])
    .filter((item) => item?.isActive !== false)
    .map((item) => String(item?.email ?? '').trim())
    .filter(Boolean);

const getDispatchErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unknown error';

const isTemplateMissingError = (message: string): boolean =>
  message.includes(TEMPLATE_MISSING_ERROR_FRAGMENT);

export default factories.createCoreController(MODEL_UID, ({ strapi }) => ({
  async dispatchEmail(ctx) {
    const body = (ctx.request.body ?? {}) as TDispatchBody;
    const { routingConfigDocumentId, leadFormDocumentId, pageSlug, leadData } = body;

    if (!leadData || typeof leadData !== 'object' || Array.isArray(leadData)) {
      return ctx.badRequest('leadData es requerido y debe ser un objeto');
    }

    if (!routingConfigDocumentId && !leadFormDocumentId) {
      return ctx.badRequest(
        'Debe enviar routingConfigDocumentId o leadFormDocumentId'
      );
    }

    const filters = buildRoutingFilters(
      routingConfigDocumentId,
      leadFormDocumentId
    );

    const configs = (await strapi.entityService.findMany(MODEL_UID, {
      filters,
      populate: {
        lead_form: { fields: ['name'] },
        email_lead_recipients: { fields: ['email', 'isActive'] },
      },
      limit: 25,
    })) as TRoutingConfig[];

    if (!routingConfigDocumentId && configs.length > 1) {
      return ctx.badRequest(
        'Hay más de una configuración activa para el formulario. Envíe routingConfigDocumentId.'
      );
    }

    const selectedConfig = selectRoutingConfig(configs, routingConfigDocumentId);
    if (!selectedConfig) {
      return ctx.notFound('No se encontró una configuración activa de enrutamiento');
    }

    const recipients = resolveRecipients(selectedConfig.email_lead_recipients);

    if (!recipients.length) {
      return ctx.badRequest(
        'La configuración no tiene destinatarios de correo activos'
      );
    }

    let results: TLeadDistributionEmailResult[];
    try {
      results = await sendLeadDistributionEmail(strapi, {
        recipients,
        leadData,
        context: {
          leadFormName: selectedConfig.lead_form?.name ?? '',
          pageSlug: typeof pageSlug === 'string' ? pageSlug : '',
        },
      });
    } catch (error) {
      const message = getDispatchErrorMessage(error);
      strapi.log.error(`[lead-routing] Error en dispatchEmail: ${message}`);

      if (isTemplateMissingError(message)) {
        return ctx.badRequest(
          'No existe template configurado para la distribución de leads'
        );
      }

      return ctx.internalServerError(
        'No se pudo completar el envío de distribución de leads'
      );
    }

    const sentCount = results.filter((item) => item.status === 'sent').length;

    ctx.body = {
      success: sentCount > 0,
      sentCount,
      totalRecipients: results.length,
      distributionMode: selectedConfig.distributionMode,
      routingConfig: {
        id: selectedConfig.id,
        documentId: selectedConfig.documentId,
        name: selectedConfig.name,
      },
      results,
    };
  },
}));
