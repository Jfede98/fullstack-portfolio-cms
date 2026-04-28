type THttpError = Error & {
  status: number;
  statusCode: number;
};

class EmailTemplateValidationError extends Error implements THttpError {
  status: number;
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'EmailTemplateValidationError';
    this.status = 400;
    this.statusCode = 400;
  }
}

const assertValidTemplateId = (templateId: unknown, label: string): number => {
  if (!Number.isInteger(templateId) || Number(templateId) <= 0) {
    throw new EmailTemplateValidationError(
      `El templateId para ${label} debe ser un entero positivo`
    );
  }

  return Number(templateId);
};

const validateTemplateIdExists = async (templateId: unknown, label: string) => {
  const safeTemplateId = assertValidTemplateId(templateId, label);

  const templates = await strapi.entityService.findMany(
    'plugin::email-designer-v5.email-designer-template',
    {
      filters: { templateReferenceId: safeTemplateId },
      fields: ['id'],
      limit: 1,
    }
  );

  const template = Array.isArray(templates) ? templates[0] : templates;

  if (!template) {
    throw new EmailTemplateValidationError(
      `No existe la plantilla de Email Designer con referenceId "${templateId}" para ${label}`
    );
  }
};

export default {
  async beforeCreate(event) {
    const { inviteTemplateId, leadDistributionTemplateId } = event.params?.data ?? {};
    await validateTemplateIdExists(inviteTemplateId, 'invitación');
    await validateTemplateIdExists(leadDistributionTemplateId, 'distribución de leads');
  },

  async beforeUpdate(event) {
    const data = event.params?.data ?? {};
    const hasOwn = (key: string) => Object.prototype.hasOwnProperty.call(data, key);
    const { inviteTemplateId, leadDistributionTemplateId } = data;

    if (hasOwn('inviteTemplateId')) {
      await validateTemplateIdExists(inviteTemplateId, 'invitación');
    }

    if (hasOwn('leadDistributionTemplateId')) {
      await validateTemplateIdExists(leadDistributionTemplateId, 'distribución de leads');
    }
  },
};
