type TLifecycleModule = {
  default: {
    beforeCreate: (event: { params?: { data?: Record<string, unknown> } }) => Promise<void>;
    beforeUpdate: (event: { params?: { data?: Record<string, unknown> } }) => Promise<void>;
  };
};

const loadLifecycle = async (findMany: jest.Mock) => {
  jest.resetModules();
  (global as unknown as { strapi: unknown }).strapi = {
    entityService: {
      findMany,
    },
  };
  const mod = (await import(
    '../src/api/email-setting/content-types/email-setting/lifecycles'
  )) as TLifecycleModule;
  return mod.default;
};

describe('email-setting lifecycle', () => {
  it('validates invite and lead templates on create', async () => {
    const findMany = jest.fn().mockResolvedValue([{ id: 1 }]);
    const lifecycle = await loadLifecycle(findMany);

    await lifecycle.beforeCreate({
      params: {
        data: {
          inviteTemplateId: 10,
          leadDistributionTemplateId: 20,
        },
      },
    });

    expect(findMany).toHaveBeenCalledTimes(2);
  });

  it('throws when template id is not positive integer', async () => {
    const findMany = jest.fn().mockResolvedValue([{ id: 1 }]);
    const lifecycle = await loadLifecycle(findMany);

    await expect(
      lifecycle.beforeCreate({
        params: {
          data: {
            inviteTemplateId: 0,
          },
        },
      })
    ).rejects.toThrow('El templateId para invitación debe ser un entero positivo');
  });

  it('throws when lead template does not exist on update', async () => {
    const findMany = jest
      .fn()
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([]);
    const lifecycle = await loadLifecycle(findMany);

    await expect(
      lifecycle.beforeUpdate({
        params: {
          data: {
            inviteTemplateId: 10,
            leadDistributionTemplateId: 999,
          },
        },
      })
    ).rejects.toThrow(
      'No existe la plantilla de Email Designer con referenceId "999" para distribución de leads'
    );
  });

  it('validates template existence when query returns a single object (non-array)', async () => {
    const findMany = jest.fn().mockResolvedValue({ id: 1 });
    const lifecycle = await loadLifecycle(findMany);

    await lifecycle.beforeCreate({
      params: {
        data: {
          inviteTemplateId: 10,
          leadDistributionTemplateId: 20,
        },
      },
    });

    expect(findMany).toHaveBeenCalledTimes(2);
  });

  it('throws on create when lead template is null', async () => {
    const findMany = jest.fn().mockResolvedValue([{ id: 1 }]);
    const lifecycle = await loadLifecycle(findMany);

    await expect(
      lifecycle.beforeCreate({
        params: {
          data: {
            inviteTemplateId: 10,
            leadDistributionTemplateId: null,
          },
        },
      })
    ).rejects.toThrow(
      'El templateId para distribución de leads debe ser un entero positivo'
    );
  });

  it('skips validations on update when ids are not provided', async () => {
    const findMany = jest.fn().mockResolvedValue([{ id: 1 }]);
    const lifecycle = await loadLifecycle(findMany);

    await lifecycle.beforeUpdate({
      params: {
        data: {},
      },
    });

    expect(findMany).not.toHaveBeenCalled();
  });

  it('throws on update when leadDistributionTemplateId is explicitly null', async () => {
    const findMany = jest.fn().mockResolvedValue([{ id: 1 }]);
    const lifecycle = await loadLifecycle(findMany);

    await expect(
      lifecycle.beforeUpdate({
        params: {
          data: {
            leadDistributionTemplateId: null,
          },
        },
      })
    ).rejects.toThrow(
      'El templateId para distribución de leads debe ser un entero positivo'
    );
  });

  it('skips validations on update when event params are missing', async () => {
    const findMany = jest.fn().mockResolvedValue([{ id: 1 }]);
    const lifecycle = await loadLifecycle(findMany);

    await lifecycle.beforeUpdate({});

    expect(findMany).not.toHaveBeenCalled();
  });

  it('throws on create when params are missing and inviteTemplateId cannot be validated', async () => {
    const findMany = jest.fn().mockResolvedValue([{ id: 1 }]);
    const lifecycle = await loadLifecycle(findMany);

    await expect(lifecycle.beforeCreate({})).rejects.toThrow(
      'El templateId para invitación debe ser un entero positivo'
    );
    expect(findMany).not.toHaveBeenCalled();
  });
});
