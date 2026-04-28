export {};

type Middleware = (
  ctx: {
    request: { url?: string };
    set: jest.Mock;
  },
  next: () => Promise<void>
) => Promise<void>;

const loadMiddleware = async () => {
  const mod = await import("../src/middlewares/admin-cors");
  const factory = (mod as { default?: unknown }).default || mod;
  return (factory as () => Middleware)();
};

describe("admin-cors middleware", () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.SSH_SERVER_HOST;
  });

  it("sets CORS headers for /admin when SSH_SERVER_HOST is defined", async () => {
    process.env.SSH_SERVER_HOST = "https://localhost:1337/admin";
    const middleware = await loadMiddleware();
    const ctx = {
      request: { url: "/admin" },
      set: jest.fn(),
    };
    const next = jest.fn().mockResolvedValue(undefined);

    await middleware(ctx, next);

    expect(ctx.set).toHaveBeenCalledWith(
      "Access-Control-Allow-Origin",
      "https://localhost:1337"
    );
    expect(ctx.set).toHaveBeenCalledWith(
      "Access-Control-Allow-Credentials",
      "true"
    );
  });

  it("does not set CORS headers for non-admin paths", async () => {
    process.env.SSH_SERVER_HOST = "https://localhost:1337";
    const middleware = await loadMiddleware();
    const ctx = {
      request: { url: "/api/pages" },
      set: jest.fn(),
    };
    const next = jest.fn().mockResolvedValue(undefined);

    await middleware(ctx, next);

    expect(ctx.set).not.toHaveBeenCalled();
  });
});
