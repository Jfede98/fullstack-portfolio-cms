export {};

const createCoreControllerMock = jest.fn(
  (_uid: string, builder: (args: { strapi: unknown }) => unknown) => builder
);

jest.mock('@strapi/strapi', () => ({
  factories: {
    createCoreController: (...args: unknown[]) =>
      createCoreControllerMock(
        ...(args as [string, (args: { strapi: unknown }) => unknown])
      ),
  },
}));

type TLeadFormControllerFactory = (args: {
  strapi: unknown;
}) => {
  getFullByDocumentId: (ctx: unknown) => Promise<unknown>;
};

const loadController = async (): Promise<TLeadFormControllerFactory> => {
  const mod = await import('../src/api/lead-form/controllers/lead-form');
  return (mod as { default: TLeadFormControllerFactory }).default;
};

const makeCtx = (
  documentId?: string,
  options?: { withParams?: boolean }
) => {
  const withParams = options?.withParams ?? true;
  const ctx: Record<string, unknown> = {
    badRequest: jest.fn((message: string) => {
      ctx.status = 400;
      ctx.body = { error: message };
    }),
    notFound: jest.fn((message: string) => {
      ctx.status = 404;
      ctx.body = { error: message };
    }),
  };

  if (withParams) {
    ctx.params = { documentId };
  }

  return ctx;
};

describe('lead-form getFullByDocumentId controller', () => {
  beforeEach(() => {
    jest.resetModules();
    createCoreControllerMock.mockClear();
  });

  it('returns 400 when documentId is missing', async () => {
    const strapi = {
      entityService: { findMany: jest.fn() },
    };
    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx('');

    await controller.getFullByDocumentId(ctx);

    expect(ctx.badRequest).toHaveBeenCalledWith('documentId es requerido');
    expect(strapi.entityService.findMany).not.toHaveBeenCalled();
  });

  it('returns 400 when params object is missing', async () => {
    const strapi = {
      entityService: { findMany: jest.fn() },
    };
    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx(undefined, { withParams: false });

    await controller.getFullByDocumentId(ctx);

    expect(ctx.badRequest).toHaveBeenCalledWith('documentId es requerido');
    expect(strapi.entityService.findMany).not.toHaveBeenCalled();
  });

  it('returns 404 when active lead form is not found', async () => {
    const strapi = {
      entityService: { findMany: jest.fn().mockResolvedValue([]) },
    };
    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx('lf_missing');

    await controller.getFullByDocumentId(ctx);

    expect(ctx.notFound).toHaveBeenCalledWith('No se encontró lead form activo');
  });

  it('returns full payload with active routing config data', async () => {
    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 7,
            documentId: 'lf_1',
            name: 'Formulario Prueba',
            channel: 'Canal CMS',
            variant: 'DSA',
            form: {
              title: 'Prueba',
              description: 'Desc',
              inputs: [{ name: 'email', type: 'email' }],
            },
            lead_routing_configs: [
              {
                id: 11,
                documentId: 'rc_inactive',
                distributionMode: 'tom',
                isActive: false,
              },
              {
                id: 12,
                documentId: 'rc_active',
                distributionMode: 'both',
                isActive: true,
              },
            ],
          },
        ]),
      },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx('lf_1');

    await controller.getFullByDocumentId(ctx);

    expect(strapi.entityService.findMany).toHaveBeenCalledWith(
      'api::lead-form.lead-form',
      expect.objectContaining({
        filters: {
          documentId: { $eq: 'lf_1' },
          isActive: { $eq: true },
        },
        limit: 1,
      })
    );

    expect(ctx.body).toEqual({
      leadFormDocumentId: 'lf_1',
      leadFormName: 'Formulario Prueba',
      channel: 'Canal CMS',
      variant: 'DSA',
      automaticFlow: false,
      form: {
        title: 'Prueba',
        description: 'Desc',
        inputs: [{ name: 'email', type: 'email' }],
      },
      routingConfigDocumentId: 'rc_active',
      distributionMode: 'both',
    });
  });

  it('selects active routing config deterministically by id when more than one is active', async () => {
    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 15,
            documentId: 'lf_6',
            name: 'Multiple Active',
            channel: 'Canal Multiple',
            form: {
              title: 'Formulario Multiple',
              description: 'Desc',
              inputs: [{ name: 'email', type: 'email' }],
            },
            lead_routing_configs: [
              {
                id: 30,
                documentId: 'rc_higher_id',
                distributionMode: 'both',
                isActive: true,
              },
              {
                id: 20,
                documentId: 'rc_lower_id',
                distributionMode: 'email',
                isActive: true,
              },
            ],
          },
        ]),
      },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx('lf_6');

    await controller.getFullByDocumentId(ctx);

    expect(ctx.body).toEqual(
      expect.objectContaining({
        leadFormDocumentId: 'lf_6',
        channel: 'Canal Multiple',
        variant: 'default',
        routingConfigDocumentId: 'rc_lower_id',
        distributionMode: 'email',
      })
    );
  });

  it('returns 404 when lead form exists but form body is missing', async () => {
    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 9,
            documentId: 'lf_2',
            name: 'Form Incompleto',
          },
        ]),
      },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx('lf_2');

    await controller.getFullByDocumentId(ctx);

    expect(ctx.notFound).toHaveBeenCalledWith('No se encontró lead form activo');
  });

  it('returns payload without routing config when none are active', async () => {
    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 10,
            documentId: 'lf_3',
            channel: 'Canal Sin Routing',
            form: {
              title: 'Sin Routing',
              description: 'Desc',
              inputs: [{ name: 'telefono', type: 'text' }],
            },
            lead_routing_configs: [
              {
                id: 21,
                documentId: 'rc_disabled',
                distributionMode: 'email',
                isActive: false,
              },
            ],
          },
        ]),
      },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx('lf_3');

    await controller.getFullByDocumentId(ctx);

    expect(ctx.body).toEqual({
      leadFormDocumentId: 'lf_3',
      leadFormName: '',
      channel: 'Canal Sin Routing',
      variant: 'default',
      automaticFlow: false,
      form: {
        title: 'Sin Routing',
        description: 'Desc',
        inputs: [{ name: 'telefono', type: 'text' }],
      },
      routingConfigDocumentId: undefined,
      distributionMode: undefined,
    });
  });

  it('returns payload when lead_routing_configs is undefined', async () => {
    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 13,
            documentId: 'lf_4',
            name: 'Sin Relacion',
            channel: 'Canal Sin Relacion',
            form: {
              title: 'Formulario Base',
              description: 'Desc',
              inputs: [{ name: 'nombre', type: 'text' }],
            },
          },
        ]),
      },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx('lf_4');

    await controller.getFullByDocumentId(ctx);

    expect(ctx.body).toEqual({
      leadFormDocumentId: 'lf_4',
      leadFormName: 'Sin Relacion',
      channel: 'Canal Sin Relacion',
      variant: 'default',
      automaticFlow: false,
      form: {
        title: 'Formulario Base',
        description: 'Desc',
        inputs: [{ name: 'nombre', type: 'text' }],
      },
      routingConfigDocumentId: undefined,
      distributionMode: undefined,
    });
  });

  it('handles nullish items inside lead_routing_configs array', async () => {
    const strapi = {
      entityService: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 14,
            documentId: 'lf_5',
            name: 'Con Nulos',
            channel: 'Canal Nulos',
            form: {
              title: 'Formulario Nulos',
              description: 'Desc',
              inputs: [{ name: 'correo', type: 'email' }],
            },
            lead_routing_configs: [undefined],
          },
        ]),
      },
    };

    const controllerFactory = await loadController();
    const controller = controllerFactory({ strapi });
    const ctx = makeCtx('lf_5');

    await controller.getFullByDocumentId(ctx);

    expect(ctx.body).toEqual({
      leadFormDocumentId: 'lf_5',
      leadFormName: 'Con Nulos',
      channel: 'Canal Nulos',
      variant: 'default',
      automaticFlow: false,
      form: {
        title: 'Formulario Nulos',
        description: 'Desc',
        inputs: [{ name: 'correo', type: 'email' }],
      },
      routingConfigDocumentId: undefined,
      distributionMode: undefined,
    });
  });
});
