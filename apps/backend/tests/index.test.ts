type BootstrapModule = {
  register: () => void;
  bootstrap: (args: { strapi: unknown }) => Promise<void>;
};

const registerAdminUserInviteLifecycle = jest.fn();
const registerCspSyncLifecycle = jest.fn().mockResolvedValue(undefined);
const registerButtonValidationLifecycle = jest.fn();

jest.mock("../src/lifecycles/admin-user-invite", () => ({
  registerAdminUserInviteLifecycle: (...args: unknown[]) =>
    registerAdminUserInviteLifecycle(...args)
}));

jest.mock("../src/lifecycles/csp-sync", () => ({
  registerCspSyncLifecycle: (...args: unknown[]) =>
    registerCspSyncLifecycle(...args)
}));

jest.mock("../src/lifecycles/button-validation", () => ({
  registerButtonValidationLifecycle: (...args: unknown[]) =>
    registerButtonValidationLifecycle(...args)
}));

const loadBootstrap = async (): Promise<BootstrapModule> => {
  const mod = await import("../src/index");
  return (mod as { default?: BootstrapModule }).default as BootstrapModule;
};

describe("bootstrap index", () => {
  beforeEach(() => {
    jest.resetModules();
    registerAdminUserInviteLifecycle.mockReset();
    registerCspSyncLifecycle.mockReset();
    registerCspSyncLifecycle.mockResolvedValue(undefined);
    registerButtonValidationLifecycle.mockReset();
  });

  it("registers without side effects", async () => {
    const { register } = await loadBootstrap();
    expect(() => register()).not.toThrow();
  });

  it("wires lifecycles with normalized SSH_SERVER_HOST", async () => {
    process.env.SSH_SERVER_HOST = "https://admin.example.com/";
    const strapi = {
      id: "strapi-mock",
      server: {
        httpServer: {
          setTimeout: jest.fn(),
          headersTimeout: 0,
          keepAliveTimeout: 0,
        },
      },
    };
    const { bootstrap } = await loadBootstrap();

    await bootstrap({ strapi });

    expect(registerAdminUserInviteLifecycle).toHaveBeenCalledWith(
      strapi,
      "https://admin.example.com"
    );
    expect(registerCspSyncLifecycle).toHaveBeenCalledWith(strapi);
  });

  it("passes undefined SSH_SERVER_HOST when not configured", async () => {
    delete process.env.SSH_SERVER_HOST;
    const strapi = {
      id: "strapi-mock",
      server: {
        httpServer: {
          setTimeout: jest.fn(),
          headersTimeout: 0,
          keepAliveTimeout: 0,
        },
      },
    };
    const { bootstrap } = await loadBootstrap();

    await bootstrap({ strapi });

    expect(registerAdminUserInviteLifecycle).toHaveBeenCalledWith(
      strapi,
      undefined
    );
    expect(registerCspSyncLifecycle).toHaveBeenCalledWith(strapi);
  });
});
