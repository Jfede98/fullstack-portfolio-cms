export {};

type Middleware = (ctx: TestCtx, next: () => Promise<void>) => Promise<void>;

const buildMiddleware = async () => {
  const mod = await import('../src/middlewares/custom-validation-cors');
  const factory = (mod as { default?: unknown }).default || mod;
  return (factory as () => Middleware)();
};

type TestCtx = {
  request: {
    url: string;
    headers: { origin?: string };
  };
  status?: number;
  body?: unknown;
  set: jest.Mock;
  remove: jest.Mock;
};

const makeCtx = ({
  url,
  origin,
}: {
  url: string;
  origin?: string;
}): TestCtx => ({
  request: {
    url,
    headers: origin ? { origin } : {},
  },
  status: undefined,
  body: undefined,
  set: jest.fn(),
  remove: jest.fn(),
});

describe('custom-validation-cors middleware', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  
  afterEach(() => {
    delete process.env.CORS_ALLOWED_ORIGINS;
    delete process.env.SSH_SERVER_HOST;
  });

  it('blocks API call when env is missing and origin is present', async () => {
    delete process.env.CORS_ALLOWED_ORIGINS;
    const middleware = await buildMiddleware();
    const ctx = makeCtx({ url: '/api/test', origin: 'https://example.com' });
    const next = jest.fn();

    await middleware(ctx, next);

    expect(ctx.status).toBe(403);
    expect(ctx.body).toEqual({
      message: 'Access denied by CORS policy: The origin is not allowed.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('allows revalidate endpoint without origin checks', async () => {
    process.env.CORS_ALLOWED_ORIGINS = 'example.com';
    const middleware = await buildMiddleware();
    const ctx = makeCtx({ url: '/api/revalidate/revalidate' });
    const next = jest.fn();

    await middleware(ctx, next);

    expect(ctx.status).toBeUndefined();
    expect(ctx.body).toBeUndefined();
    expect(ctx.set).not.toHaveBeenCalled();
    expect(ctx.remove).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('blocks API calls without origin', async () => {
    process.env.CORS_ALLOWED_ORIGINS = 'example.com';
    const middleware = await buildMiddleware();
    const ctx = makeCtx({ url: '/api/test' });
    const next = jest.fn();

    await middleware(ctx, next);

    expect(ctx.status).toBe(403);
    expect(ctx.body).toEqual({ message: 'Add Origin to Headers' });
    expect(ctx.remove).toHaveBeenCalledWith('Access-Control-Allow-Origin');
    expect(ctx.remove).toHaveBeenCalledWith('Access-Control-Allow-Credentials');
    expect(next).not.toHaveBeenCalled();
  });

  it('blocks API calls from disallowed origins', async () => {
    process.env.CORS_ALLOWED_ORIGINS = 'example.com';
    const middleware = await buildMiddleware();
    const ctx = makeCtx({ url: '/api/test', origin: 'https://evil.com' });
    const next = jest.fn();

    await middleware(ctx, next);

    expect(ctx.status).toBe(403);
    expect(ctx.body).toEqual({
      message: 'Access denied by CORS policy: The origin is not allowed.',
    });
    expect(ctx.remove).toHaveBeenCalledWith('Access-Control-Allow-Origin');
    expect(ctx.remove).toHaveBeenCalledWith('Access-Control-Allow-Credentials');
    expect(next).not.toHaveBeenCalled();
  });

  it('allows API calls from allowed origins', async () => {
    process.env.CORS_ALLOWED_ORIGINS = 'example.com,*.xtrim.com';
    const middleware = await buildMiddleware();
    const ctx = makeCtx({ url: '/api/test', origin: 'https://api.xtrim.com' });
    const next = jest.fn();

    await middleware(ctx, next);

    expect(ctx.status).toBeUndefined();
    expect(ctx.body).toBeUndefined();
    expect(ctx.set).toHaveBeenCalledWith(
      'Access-Control-Allow-Origin',
      'https://api.xtrim.com'
    );
    expect(ctx.set).toHaveBeenCalledWith(
      'Access-Control-Allow-Credentials',
      'true'
    );
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('passes through non-api requests', async () => {
    process.env.CORS_ALLOWED_ORIGINS = ' example.com ';
    const middleware = await buildMiddleware();
    const ctx = makeCtx({ url: '/health', origin: 'https://example.com' });
    const next = jest.fn();

    await middleware(ctx, next);

    expect(ctx.status).toBeUndefined();
    expect(ctx.body).toBeUndefined();
    expect(ctx.set).not.toHaveBeenCalled();
    expect(ctx.remove).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('allows origin that matches after protocol normalization', async () => {
    process.env.CORS_ALLOWED_ORIGINS = 'example.com';
    const middleware = await buildMiddleware();
    const ctx = makeCtx({ url: '/api/test', origin: 'example.com' });
    const next = jest.fn();

    await middleware(ctx, next);

    expect(ctx.status).toBeUndefined();
    expect(ctx.set).toHaveBeenCalledWith('Access-Control-Allow-Origin', 'example.com');
    expect(ctx.set).toHaveBeenCalledWith('Access-Control-Allow-Credentials', 'true');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('passes through when url is missing', async () => {
    process.env.CORS_ALLOWED_ORIGINS = 'example.com';
    const middleware = await buildMiddleware();
    const ctx = makeCtx({ url: '/health', origin: 'https://example.com' }) as TestCtx & {
      request: { url?: string; headers: { origin?: string } };
    };
    const next = jest.fn();

    await middleware(ctx, next);

    expect(ctx.status).toBeUndefined();
    expect(ctx.body).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('allows origin derived from SSH_SERVER_HOST', async () => {
    delete process.env.CORS_ALLOWED_ORIGINS;
    process.env.SSH_SERVER_HOST = 'https://3.91.167.105:1339/admin';
    const middleware = await buildMiddleware();
    const ctx = makeCtx({ url: '/api/test', origin: 'https://3.91.167.105:1339' });
    const next = jest.fn();

    await middleware(ctx, next);

    expect(ctx.status).toBeUndefined();
    expect(ctx.set).toHaveBeenCalledWith(
      'Access-Control-Allow-Origin',
      'https://3.91.167.105:1339'
    );
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('keeps working when SSH_SERVER_HOST is not a valid URL', async () => {
    process.env.CORS_ALLOWED_ORIGINS = 'example.com';
    process.env.SSH_SERVER_HOST = '::::';
    const middleware = await buildMiddleware();
    const ctx = makeCtx({ url: '/api/test', origin: 'https://example.com' });
    const next = jest.fn();

    await middleware(ctx, next);

    expect(ctx.status).toBeUndefined();
    expect(ctx.set).toHaveBeenCalledWith(
      'Access-Control-Allow-Origin',
      'https://example.com'
    );
    expect(next).toHaveBeenCalledTimes(1);
  });
});
