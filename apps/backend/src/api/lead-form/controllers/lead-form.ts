/**
 * lead-form controller
 */

import { factories } from '@strapi/strapi';

const MODEL_UID = 'api::lead-form.lead-form';

type TLeadFormEntity = {
  id: number;
  documentId: string;
  name?: string;
  channel?: string;
  variant?: 'default' | 'DSA';
  isActive?: boolean;
  automaticFlow?: boolean;
  form?: unknown;
  lead_routing_configs?: {
    id: number;
    documentId?: string;
    distributionMode?: 'email' | 'tom' | 'both';
    isActive?: boolean;
    name?: string;
  }[];
};

const isRoutingConfigActive = (
  config: TLeadFormEntity['lead_routing_configs'][number] | undefined
): boolean => config?.isActive !== false;

const selectActiveRoutingConfig = (
  configs?: TLeadFormEntity['lead_routing_configs']
) => {
  const activeConfigs = (configs ?? []).filter(isRoutingConfigActive);
  if (activeConfigs.length === 0) return undefined;

  // Deterministic selection to avoid non-deterministic DB ordering.
  return activeConfigs.sort((a, b) => a.id - b.id)[0];
};

export default factories.createCoreController(MODEL_UID, ({ strapi }) => ({
  async getFullByDocumentId(ctx) {
    const documentId = String(ctx.params?.documentId ?? '').trim();
    if (!documentId) {
      return ctx.badRequest('documentId es requerido');
    }

    const forms = (await strapi.entityService.findMany(MODEL_UID, {
      filters: {
        documentId: { $eq: documentId },
        isActive: { $eq: true },
      },
      populate: {
        form: {
          populate: {
            icon: true,
            button: {
              populate: {
                icon: true,
              },
            },
            inputs: {
              populate: {
                icon: true,
                options: true,
              },
            },
            privacyCheckbox: true,
            statusMessage: true,
          },
        },
        lead_routing_configs: true,
      },
      limit: 1,
    })) as TLeadFormEntity[];

    const form = forms[0];
    if (!form?.documentId || !form.form) {
      return ctx.notFound('No se encontró lead form activo');
    }

    const activeConfig = selectActiveRoutingConfig(form.lead_routing_configs);

    ctx.body = {
      leadFormDocumentId: form.documentId,
      leadFormName: form.name ?? '',
      channel: form.channel,
      variant: form.variant ?? 'default',
      automaticFlow: form.automaticFlow ?? false,
      form: form.form,
      routingConfigDocumentId: activeConfig?.documentId,
      distributionMode: activeConfig?.distributionMode,
    };
  },
}));
