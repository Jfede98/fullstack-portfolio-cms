const createCoreControllerMock = jest.fn(
  (_uid: string, builder: (args: { strapi: unknown }) => unknown) => builder
);

jest.mock('@strapi/strapi', () => ({
  factories: {
    createCoreController: (...args: unknown[]) =>
      createCoreControllerMock(...(args as [string, (...args: unknown[]) => unknown])),
  },
}));

const loadPageController = async () => {
  const mod = await import('../src/api/page/controllers/page');
  return (mod as { default: (args: { strapi: unknown }) => unknown }).default;
};

const loadPageRoutes = async () => {
  const mod = await import('../src/api/page/routes/01-custom-page');
  return (mod as { default: { routes: Array<Record<string, unknown>> } }).default;
};

describe('page sitemap controller', () => {
  beforeEach(() => {
    jest.resetModules();
    createCoreControllerMock.mockClear();
  });

  it('returns sitemap entries', async () => {
    const entries = [{ slug: 'home' }];
    const strapi = {
      documents: jest.fn().mockReturnValue({
        findMany: jest.fn().mockResolvedValue(entries),
      }),
    };
    const pageController = await loadPageController();
    const controller = pageController({ strapi }) as { sitemap: (ctx: unknown) => Promise<void> };
    const ctx: { body?: unknown; status?: number } = {};

    await controller.sitemap(ctx);

    expect(strapi.documents).toHaveBeenCalledWith('api::page.page');
    expect(ctx.body).toBe(entries);
    expect(ctx.status).toBeUndefined();
  });

  it('sets 500 on sitemap error', async () => {
    const error = new Error('boom');
    const strapi = {
      documents: jest.fn().mockReturnValue({
        findMany: jest.fn().mockRejectedValue(error),
      }),
    };
    const pageController = await loadPageController();
    const controller = pageController({ strapi }) as { sitemap: (ctx: unknown) => Promise<void> };
    const ctx: { body?: unknown; status?: number } = {};

    await controller.sitemap(ctx);

    expect(ctx.status).toBe(500);
    expect(ctx.body).toBe(error);
  });
});

describe('page findBySlug controller', () => {
  beforeEach(() => {
    jest.resetModules();
    createCoreControllerMock.mockClear();
  });

  it('returns page payload when slug exists', async () => {
    const page = { slug: 'home' };
    const findFirst = jest.fn().mockResolvedValue(page);
    const strapi = {
      documents: jest.fn().mockReturnValue({
        findFirst,
      }),
    };
    const pageController = await loadPageController();
    const controller = pageController({ strapi }) as { findBySlug: (ctx: unknown) => Promise<void> };
    const ctx: {
      body?: unknown;
      query?: { slug?: string; locale?: string };
      badRequest?: jest.Mock;
      notFound?: jest.Mock;
    } = {
      query: { slug: 'home', locale: 'es' },
      badRequest: jest.fn(),
      notFound: jest.fn(),
    };

    await controller.findBySlug(ctx);

    expect(strapi.documents).toHaveBeenCalledWith('api::page.page');
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'published',
        filters: { slug: { $eq: 'home' } },
        locale: 'es',
      })
    );
    expect(ctx.body).toEqual({
      data: page,
      meta: {},
    });
  });

  it('returns badRequest when slug is missing', async () => {
    const findFirst = jest.fn();
    const strapi = {
      documents: jest.fn().mockReturnValue({
        findFirst,
      }),
    };
    const pageController = await loadPageController();
    const controller = pageController({ strapi }) as { findBySlug: (ctx: unknown) => Promise<void> };
    const badRequest = jest.fn();
    const ctx: { query?: Record<string, string>; badRequest: jest.Mock } = {
      badRequest,
    };

    await controller.findBySlug(ctx);

    expect(badRequest).toHaveBeenCalledWith('slug es requerido');
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('returns notFound when slug does not exist', async () => {
    const strapi = {
      documents: jest.fn().mockReturnValue({
        findFirst: jest.fn().mockResolvedValue(null),
      }),
    };
    const pageController = await loadPageController();
    const controller = pageController({ strapi }) as { findBySlug: (ctx: unknown) => Promise<void> };
    const notFound = jest.fn();
    const ctx: { query?: { slug?: string }; notFound: jest.Mock } = {
      query: { slug: 'missing' },
      notFound,
    };

    await controller.findBySlug(ctx);

    expect(notFound).toHaveBeenCalledWith(
      'No se encontró page para slug [missing]'
    );
  });

  it('normalizes slug and ignores non-string locale', async () => {
    const page = { slug: 'home' };
    const findFirst = jest.fn().mockResolvedValue(page);
    const strapi = {
      documents: jest.fn().mockReturnValue({
        findFirst,
      }),
    };
    const pageController = await loadPageController();
    const controller = pageController({ strapi }) as { findBySlug: (ctx: unknown) => Promise<void> };
    const ctx = {
      query: { slug: '  home  ', locale: 123 as unknown as string },
      badRequest: jest.fn(),
      notFound: jest.fn(),
      body: undefined as unknown,
    };

    await controller.findBySlug(ctx);

    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'published',
        filters: { slug: { $eq: 'home' } },
        locale: undefined,
      })
    );
    expect(ctx.body).toEqual({
      data: page,
      meta: {},
    });
  });
});

describe('page sitemap route', () => {
  it('exposes custom page routes', async () => {
    const routes = await loadPageRoutes();

    expect(routes.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          method: 'GET',
          path: '/pages/by-slug',
          handler: 'page.findBySlug',
        }),
        expect.objectContaining({
          method: 'GET',
          path: '/pages/sitemap',
          handler: 'page.sitemap',
        }),
      ])
    );
  });
});
