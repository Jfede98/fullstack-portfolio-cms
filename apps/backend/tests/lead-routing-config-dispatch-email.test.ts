export {};

const createCoreControllerMock = jest.fn(
  (_uid: string, builder: (args: { strapi: unknown }) => unknown) => builder
);

jest.mock('@strapi/strapi', () => ({
  factories: {
    createCoreController: (...args: unknown[]) =>
      createCoreControllerMock(...(args as [string, (...args: unknown[]) => unknown])),
  },
}));

const sendLeadDistributionEmailMock = jest.fn();

jest.mock('../src/utils/lead-distribution-email', () => ({
  sendLeadDistributionEmail: (...args: unknown[]) =>
    sendLeadDistributionEmailMock(...args),
}));

const loadController = async () => {
  const mod = await import(
    '../src/api/lead-routing-config/controllers/lead-routing-config'
  );
  return (
    mod as { default: (args: { strapi: unknown }) => { dispatchEmail: (ctx: unknown) => Promise<unknown> } }
  ).default;
};

const makeCtx = (body: Record<string, unknown>) => {
  const ctx: Record<string, unknown> = {
    request: { body },
    badRequest: jest.fn((message: string) => {
      ctx.status = 400;
      ctx.body = { error: message };
    }),
    notFound: jest.fn((message: string) => {
      ctx.status = 404;
      ctx.body = { error: message };
    }),
    internalServerError: jest.fn((message: string) => {
      ctx.status = 500;
      ctx.body = { error: message };
    }),
  };

  return ctx;
};

const makeCtxWithoutRequestBody = () => {
  const ctx: Record<string, unknown> = {
    request: {},
    badRequest: jest.fn((message: string) => {
      ctx.status = 400;
      ctx.body = { error: message };
    }),
    notFound: jest.fn((message: string) => {
      ctx.status = 404;
      ctx.body = { error: message };
    }),
    internalServerError: jest.fn((message: string) => {
      ctx.status = 500;
      ctx.body = { error: message };
    }),
  };

  return ctx;
};

describe('lead-routing-config dispatchEmail controller', () => {
  beforeEach(() => {
    jest.resetModules();
    createCoreControllerMock.mockClear();
    sendLeadDistributionEmailMock.mockReset();
  });

  it('returns 400 when leadData is missing', async () => {
    const strapi = { entityService: { findMany: jest.fn() }, log: { error: jest.fn() } };
    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx({ routingConfigDocumentId: 'doc_1' });

    await controller.dispatchEmail(ctx);

    expect(ctx.badRequest).toHaveBeenCalledWith(
      'leadData es requerido y debe ser un objeto'
    );
  });

  it('returns 400 when request body is undefined', async () => {
    const strapi = { entityService: { findMany: jest.fn() }, log: { error: jest.fn() } };
    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtxWithoutRequestBody();

    await controller.dispatchEmail(ctx);

    expect(ctx.badRequest).toHaveBeenCalledWith(
      'leadData es requerido y debe ser un objeto'
    );
  });

  it('returns 400 when neither routingConfigDocumentId nor leadFormDocumentId is provided', async () => {
    const strapi = { entityService: { findMany: jest.fn() }, log: { error: jest.fn() } };
    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx({
      leadData: { email: 'test@example.com' },
    });

    await controller.dispatchEmail(ctx);

    expect(ctx.badRequest).toHaveBeenCalledWith(
      'Debe enviar routingConfigDocumentId o leadFormDocumentId'
    );
    expect(strapi.entityService.findMany).not.toHaveBeenCalled();
  });

  it('returns 400 when more than one config is found for leadFormDocumentId', async () => {
    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          { id: 1, documentId: 'a', name: 'A', distributionMode: 'email' },
          { id: 2, documentId: 'b', name: 'B', distributionMode: 'both' },
        ]),
      },
      log: { error: jest.fn() },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx({
      leadFormDocumentId: 'form_1',
      leadData: { email: 'test@example.com' },
    });

    await controller.dispatchEmail(ctx);

    expect(ctx.badRequest).toHaveBeenCalledWith(
      'Hay más de una configuración activa para el formulario. Envíe routingConfigDocumentId.'
    );
  });

  it('returns 400 when template is not configured', async () => {
    sendLeadDistributionEmailMock.mockRejectedValueOnce(
      new Error('[lead-email] No existe templateReferenceId para distribución de leads')
    );

    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 1,
            documentId: 'doc_1',
            name: 'TEST',
            distributionMode: 'email',
            lead_form: { name: 'Formulario' },
            email_lead_recipients: [{ email: 'a@example.com', isActive: true }],
          },
        ]),
      },
      log: { error: jest.fn() },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx({
      routingConfigDocumentId: 'doc_1',
      pageSlug: 'hfc',
      leadData: { nombre: 'Juan' },
    });

    await controller.dispatchEmail(ctx);

    expect(ctx.badRequest).toHaveBeenCalledWith(
      'No existe template configurado para la distribución de leads'
    );
  });

  it('returns 404 when no active routing config matches filters', async () => {
    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      log: { error: jest.fn() },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx({
      routingConfigDocumentId: 'missing_config',
      leadData: { nombre: 'Juan' },
    });

    await controller.dispatchEmail(ctx);

    expect(ctx.notFound).toHaveBeenCalledWith(
      'No se encontró una configuración activa de enrutamiento'
    );
  });

  it('returns 400 when routing config has no active email recipients', async () => {
    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 1,
            documentId: 'doc_1',
            name: 'TEST',
            distributionMode: 'email',
            lead_form: { name: 'Formulario' },
            email_lead_recipients: [{ email: 'a@example.com', isActive: false }],
          },
        ]),
      },
      log: { error: jest.fn() },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx({
      routingConfigDocumentId: 'doc_1',
      leadData: { nombre: 'Juan' },
    });

    await controller.dispatchEmail(ctx);

    expect(ctx.badRequest).toHaveBeenCalledWith(
      'La configuración no tiene destinatarios de correo activos'
    );
  });

  it('returns 400 when routing config has undefined recipients relation', async () => {
    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 1,
            documentId: 'doc_1',
            name: 'TEST',
            distributionMode: 'email',
            lead_form: { name: 'Formulario' },
          },
        ]),
      },
      log: { error: jest.fn() },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx({
      routingConfigDocumentId: 'doc_1',
      leadData: { nombre: 'Juan' },
    });

    await controller.dispatchEmail(ctx);

    expect(ctx.badRequest).toHaveBeenCalledWith(
      'La configuración no tiene destinatarios de correo activos'
    );
  });

  it('returns 500 when email service fails with unknown error', async () => {
    sendLeadDistributionEmailMock.mockRejectedValueOnce(new Error('smtp timeout'));

    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 1,
            documentId: 'doc_1',
            name: 'TEST',
            distributionMode: 'email',
            lead_form: { name: 'Formulario' },
            email_lead_recipients: [{ email: 'a@example.com', isActive: true }],
          },
        ]),
      },
      log: { error: jest.fn() },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx({
      routingConfigDocumentId: 'doc_1',
      leadData: { nombre: 'Juan' },
    });

    await controller.dispatchEmail(ctx);

    expect(ctx.internalServerError).toHaveBeenCalledWith(
      'No se pudo completar el envío de distribución de leads'
    );
  });

  it('uses empty lead form name and empty pageSlug when values are missing/invalid', async () => {
    sendLeadDistributionEmailMock.mockResolvedValueOnce([
      { to: 'a@example.com', status: 'sent' },
    ]);

    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 1,
            documentId: 'doc_1',
            name: 'TEST',
            distributionMode: 'email',
            lead_form: null,
            email_lead_recipients: [{ email: 'a@example.com', isActive: true }],
          },
        ]),
      },
      log: { error: jest.fn() },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx({
      routingConfigDocumentId: 'doc_1',
      pageSlug: 12345,
      leadData: { nombre: 'Juan' },
    });

    await controller.dispatchEmail(ctx);

    expect(sendLeadDistributionEmailMock).toHaveBeenCalledWith(
      strapi,
      expect.objectContaining({
        context: { leadFormName: '', pageSlug: '' },
      })
    );
  });

  it('ignores invalid recipient rows and still sends with valid recipients', async () => {
    sendLeadDistributionEmailMock.mockResolvedValueOnce([
      { to: 'ok@example.com', status: 'sent' },
    ]);

    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 1,
            documentId: 'doc_1',
            name: 'TEST',
            distributionMode: 'email',
            lead_form: { name: 'Formulario' },
            email_lead_recipients: [
              undefined,
              { email: '', isActive: true },
              { email: 'blocked@example.com', isActive: false },
              { email: 'ok@example.com', isActive: true },
            ],
          },
        ]),
      },
      log: { error: jest.fn() },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx({
      routingConfigDocumentId: 'doc_1',
      leadData: { nombre: 'Juan' },
    });

    await controller.dispatchEmail(ctx);

    expect(sendLeadDistributionEmailMock).toHaveBeenCalledWith(
      strapi,
      expect.objectContaining({
        recipients: ['ok@example.com'],
      })
    );
  });

  it('returns 500 when email service throws non-Error value', async () => {
    sendLeadDistributionEmailMock.mockRejectedValueOnce('fatal');

    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 1,
            documentId: 'doc_1',
            name: 'TEST',
            distributionMode: 'email',
            lead_form: { name: 'Formulario' },
            email_lead_recipients: [{ email: 'a@example.com', isActive: true }],
          },
        ]),
      },
      log: { error: jest.fn() },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx({
      routingConfigDocumentId: 'doc_1',
      leadData: { nombre: 'Juan' },
    });

    await controller.dispatchEmail(ctx);

    expect(strapi.log.error).toHaveBeenCalledWith(
      expect.stringContaining('Unknown error')
    );
    expect(ctx.internalServerError).toHaveBeenCalled();
  });

  it('returns success payload when email dispatch succeeds', async () => {
    sendLeadDistributionEmailMock.mockResolvedValueOnce([
      { to: 'a@example.com', status: 'sent' },
      { to: 'b@example.com', status: 'failed', errorMessage: 'boom' },
    ]);

    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 1,
            documentId: 'doc_1',
            name: 'TEST',
            distributionMode: 'email',
            lead_form: { name: 'Formulario' },
            email_lead_recipients: [
              { email: 'a@example.com', isActive: true },
              { email: 'b@example.com', isActive: true },
            ],
          },
        ]),
      },
      log: { error: jest.fn() },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx({
      routingConfigDocumentId: 'doc_1',
      pageSlug: 'hfc',
      leadData: { nombre: 'Juan' },
    });

    await controller.dispatchEmail(ctx);

    expect(sendLeadDistributionEmailMock).toHaveBeenCalledWith(
      strapi,
      expect.objectContaining({
        recipients: ['a@example.com', 'b@example.com'],
        leadData: { nombre: 'Juan' },
        context: { leadFormName: 'Formulario', pageSlug: 'hfc' },
      })
    );
    expect(ctx.body).toEqual(
      expect.objectContaining({
        success: true,
        sentCount: 1,
        totalRecipients: 2,
        routingConfig: {
          id: 1,
          documentId: 'doc_1',
          name: 'TEST',
        },
      })
    );
  });

  it('selects first config via leadFormDocumentId path when routingConfigDocumentId is absent', async () => {
    sendLeadDistributionEmailMock.mockResolvedValueOnce([
      { to: 'only@example.com', status: 'sent' },
    ]);

    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 10,
            documentId: 'doc_10',
            name: 'TEST-FORM',
            distributionMode: 'both',
            lead_form: { name: 'Formulario Lead' },
            email_lead_recipients: [
              { email: 'only@example.com', isActive: true },
            ],
          },
        ]),
      },
      log: { error: jest.fn() },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx({
      leadFormDocumentId: 'form_doc_10',
      leadData: { nombre: 'Maria' },
    });

    await controller.dispatchEmail(ctx);

    expect(sendLeadDistributionEmailMock).toHaveBeenCalledWith(
      strapi,
      expect.objectContaining({
        recipients: ['only@example.com'],
        leadData: { nombre: 'Maria' },
        context: { leadFormName: 'Formulario Lead', pageSlug: '' },
      })
    );
    expect(ctx.body).toEqual(
      expect.objectContaining({
        success: true,
        sentCount: 1,
        totalRecipients: 1,
        distributionMode: 'both',
        routingConfig: {
          id: 10,
          documentId: 'doc_10',
          name: 'TEST-FORM',
        },
      })
    );
  });
});
