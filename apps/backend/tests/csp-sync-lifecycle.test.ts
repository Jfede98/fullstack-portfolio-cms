import { registerCspSyncLifecycle, CSP_MODEL_UID } from "../src/lifecycles/csp-sync";
import { syncCspToStaticStorage } from "../src/utils/csp-sync";

jest.mock("../src/utils/csp-sync", () => ({
  syncCspToStaticStorage: jest.fn()
}));

type AfterHandler = (event: { result: { csp?: unknown; publishedAt?: string | null } }) => Promise<void>;

type StrapiMock = {
  db: {
    query: jest.Mock;
    lifecycles: {
      subscribe: jest.Mock;
    };
  };
  log: {
    warn: jest.Mock;
  };
};

const syncMock = syncCspToStaticStorage as jest.MockedFunction<
  typeof syncCspToStaticStorage
>;

const makeStrapi = (bootstrapEntity?: { csp?: unknown; publishedAt?: string | null }) => {
  const strapi: StrapiMock = {
    db: {
      query: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(bootstrapEntity ?? null)
      }),
      lifecycles: {
        subscribe: jest.fn()
      }
    },
    log: {
      warn: jest.fn()
    }
  };

  return strapi;
};

const getLifecycleHandlers = (strapi: StrapiMock) => {
  const config = strapi.db.lifecycles.subscribe.mock.calls[0][0] as {
    afterCreate: AfterHandler;
    afterUpdate: AfterHandler;
  };
  return {
    afterCreate: config.afterCreate,
    afterUpdate: config.afterUpdate
  };
};

describe("csp sync lifecycle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("registers CSP model lifecycle and syncs published CSP on bootstrap", async () => {
    const published = {
      csp: { "default-src": ["'self'"] },
      publishedAt: "2026-02-19T00:00:00.000Z"
    };
    const strapi = makeStrapi(published);

    await registerCspSyncLifecycle(strapi as unknown as never);

    expect(strapi.db.lifecycles.subscribe).toHaveBeenCalledWith(
      expect.objectContaining({
        models: [CSP_MODEL_UID],
        afterCreate: expect.any(Function),
        afterUpdate: expect.any(Function)
      })
    );
    expect(strapi.db.query).toHaveBeenCalledWith(CSP_MODEL_UID);
    expect(syncMock).toHaveBeenCalledWith(strapi, published.csp);
  });

  it("does not sync draft entities", async () => {
    const strapi = makeStrapi({
      csp: { "default-src": ["'self'"] },
      publishedAt: null
    });

    await registerCspSyncLifecycle(strapi as unknown as never);
    syncMock.mockClear();

    const { afterCreate, afterUpdate } = getLifecycleHandlers(strapi);

    await afterCreate({ result: { csp: { "default-src": ["'self'"] }, publishedAt: null } });
    await afterUpdate({ result: { csp: { "default-src": ["'self'"] } } });

    expect(syncMock).not.toHaveBeenCalled();
  });

  it("syncs on create and update only when entity is published", async () => {
    const strapi = makeStrapi(null);
    await registerCspSyncLifecycle(strapi as unknown as never);
    syncMock.mockClear();

    const { afterCreate, afterUpdate } = getLifecycleHandlers(strapi);
    const csp = { "script-src": ["'self'"] };

    await afterCreate({ result: { csp, publishedAt: "2026-02-19T01:00:00.000Z" } });
    await afterUpdate({ result: { csp, publishedAt: "2026-02-19T02:00:00.000Z" } });

    expect(syncMock).toHaveBeenNthCalledWith(1, strapi, csp);
    expect(syncMock).toHaveBeenNthCalledWith(2, strapi, csp);
  });

  it("logs warning when bootstrap query fails", async () => {
    const strapi = makeStrapi();
    const error = new Error("db-down");
    strapi.db.query.mockReturnValueOnce({
      findOne: jest.fn().mockRejectedValue(error)
    });

    await registerCspSyncLifecycle(strapi as unknown as never);

    expect(strapi.log.warn).toHaveBeenCalledWith(
      "[csp-sync] No se pudo sincronizar CSP al iniciar",
      error
    );
  });
});
