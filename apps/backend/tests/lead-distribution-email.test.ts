import { sendLeadDistributionEmail } from '../src/utils/lead-distribution-email';

type TStrapiMock = {
  db: {
    query: jest.Mock;
  };
  plugin: jest.Mock;
  log: {
    error: jest.Mock;
  };
};

const makeStrapi = () => {
  const sendTemplatedEmail = jest.fn().mockResolvedValue(undefined);
  const findOne = jest.fn().mockResolvedValue({ leadDistributionTemplateId: 123 });

  const strapi: TStrapiMock = {
    db: {
      query: jest.fn().mockReturnValue({
        findOne,
      }),
    },
    plugin: jest.fn().mockReturnValue({
      service: jest.fn().mockReturnValue({
        sendTemplatedEmail,
      }),
    }),
    log: {
      error: jest.fn(),
    },
  };

  return { strapi, sendTemplatedEmail, findOne };
};

describe('sendLeadDistributionEmail', () => {
  it('returns empty result when recipients list is empty after normalization', async () => {
    const { strapi, sendTemplatedEmail, findOne } = makeStrapi();

    const result = await sendLeadDistributionEmail(strapi as unknown as never, {
      recipients: [' ', '\n'] as unknown as string[],
      leadData: { nombre: 'Juan' },
    });

    expect(result).toEqual([]);
    expect(findOne).not.toHaveBeenCalled();
    expect(sendTemplatedEmail).not.toHaveBeenCalled();
  });

  it('ignores non-string recipients while normalizing', async () => {
    const { strapi, sendTemplatedEmail } = makeStrapi();

    const result = await sendLeadDistributionEmail(strapi as unknown as never, {
      recipients: ['valid@example.com', 123 as unknown as string] as string[],
      leadData: { nombre: 'Juan' },
      templateReferenceId: 123,
    });

    expect(sendTemplatedEmail).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ to: 'valid@example.com', status: 'sent' }]);
  });

  it('normalizes recipients and sends templated email with payload', async () => {
    const { strapi, sendTemplatedEmail } = makeStrapi();

    await sendLeadDistributionEmail(strapi as unknown as never, {
      recipients: [' A@EXAMPLE.COM ', 'a@example.com', 'b@example.com'],
      leadData: { nombre: 'Juan', ciudad: 'Quito' },
      context: { leadFormName: 'Formulario', pageSlug: 'hfc', capturedAt: '2026-03-04 10:00' },
    });

    expect(sendTemplatedEmail).toHaveBeenCalledTimes(2);
    const firstCall = sendTemplatedEmail.mock.calls[0];
    expect(firstCall[0]).toEqual({ to: 'a@example.com' });
    expect(firstCall[1]).toEqual({ templateReferenceId: 123 });
    expect(firstCall[2]).toEqual(
      expect.objectContaining({
        leadFormName: 'Formulario',
        pageSlug: 'hfc',
        inputs: [
          { key: 'nombre', value: 'Juan' },
          { key: 'ciudad', value: 'Quito' },
        ],
      })
    );
    expect(firstCall[2].capturedAt).toEqual(expect.any(String));
    expect(firstCall[2].capturedAt).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(firstCall[2].capturedAt).not.toContain('T');
    expect(firstCall[2].capturedAt).not.toContain('Z');
  });

  it('throws when no template is configured', async () => {
    const { strapi } = makeStrapi();
    strapi.db.query.mockReturnValueOnce({
      findOne: jest.fn().mockResolvedValue({}),
    });

    await expect(
      sendLeadDistributionEmail(strapi as unknown as never, {
        recipients: ['a@example.com'],
        leadData: { nombre: 'Juan' },
      })
    ).rejects.toThrow(
      '[lead-email] No existe templateReferenceId para distribución de leads'
    );
  });

  it('throws when template setting query returns undefined', async () => {
    const { strapi } = makeStrapi();
    strapi.db.query.mockReturnValueOnce({
      findOne: jest.fn().mockResolvedValue(undefined),
    });

    await expect(
      sendLeadDistributionEmail(strapi as unknown as never, {
        recipients: ['a@example.com'],
        leadData: { nombre: 'Juan' },
      })
    ).rejects.toThrow(
      '[lead-email] No existe templateReferenceId para distribución de leads'
    );
  });

  it('returns failed status when one recipient fails', async () => {
    const { strapi, sendTemplatedEmail } = makeStrapi();
    sendTemplatedEmail
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('smtp down'));

    const result = await sendLeadDistributionEmail(strapi as unknown as never, {
      recipients: ['a@example.com', 'b@example.com'],
      leadData: { nombre: 'Juan' },
      templateReferenceId: 321,
    });

    expect(result).toEqual([
      { to: 'a@example.com', status: 'sent' },
      { to: 'b@example.com', status: 'failed', errorMessage: 'smtp down' },
    ]);
    expect(strapi.log.error).toHaveBeenCalledWith(
      expect.stringContaining('[lead-email] Error enviando correo de lead a b@example.com: smtp down')
    );
  });

  it('converts nullish lead values to empty string and uses default context values', async () => {
    const { strapi, sendTemplatedEmail } = makeStrapi();

    await sendLeadDistributionEmail(strapi as unknown as never, {
      recipients: ['c@example.com'],
      leadData: { nombre: null, ciudad: undefined },
      templateReferenceId: 777,
    });

    expect(sendTemplatedEmail).toHaveBeenCalledWith(
      { to: 'c@example.com' },
      { templateReferenceId: 777 },
      expect.objectContaining({
        leadFormName: '',
        pageSlug: '',
        inputs: [
          { key: 'nombre', value: '' },
          { key: 'ciudad', value: '' },
        ],
      })
    );
  });

  it('serializes nested objects and arrays in template inputs', async () => {
    const { strapi, sendTemplatedEmail } = makeStrapi();

    await sendLeadDistributionEmail(strapi as unknown as never, {
      recipients: ['nested@example.com'],
      leadData: {
        metadata: { source: 'web', score: 10 },
        tags: ['hogar', 'promo'],
      },
      templateReferenceId: 444,
    });

    expect(sendTemplatedEmail).toHaveBeenCalledWith(
      { to: 'nested@example.com' },
      { templateReferenceId: 444 },
      expect.objectContaining({
        inputs: [
          { key: 'metadata', value: '{"source":"web","score":10}' },
          { key: 'tags', value: '["hogar","promo"]' },
        ],
      })
    );
  });

  it('uses fallback date when capturedAt is invalid and handles non-Error throws', async () => {
    const { strapi, sendTemplatedEmail } = makeStrapi();
    sendTemplatedEmail.mockRejectedValueOnce('connection-lost');

    const result = await sendLeadDistributionEmail(strapi as unknown as never, {
      recipients: ['d@example.com'],
      leadData: { nombre: 'Ana' },
      templateReferenceId: 999,
      context: { capturedAt: 'invalid-date-value' },
    });

    const [, , payload] = sendTemplatedEmail.mock.calls[0];
    expect(payload.capturedAt).toEqual(expect.any(String));
    expect(result).toEqual([
      { to: 'd@example.com', status: 'failed', errorMessage: 'Unknown error' },
    ]);
    expect(strapi.log.error).toHaveBeenCalledWith(
      expect.stringContaining('Unknown error')
    );
  });
});
