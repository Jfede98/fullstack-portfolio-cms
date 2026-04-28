const customFetchMock = jest.fn();

jest.mock("@lib/fetch", () => ({
  customFetch: (...args: unknown[]) => customFetchMock(...args)
}));

const loadModule = async (stage: "prod" | "dev") => {
  jest.resetModules();
  jest.doMock("@lib/constants/constants", () => ({
    SST_STAGE: stage,
    TOM_GESTOR_LEADS_CLIENT_GRANT_TYPE: "client_credentials",
    TOM_GESTOR_LEADS_CLIENT_ID: "id",
    TOM_GESTOR_LEADS_CLIENT_SECRET: "secret",
    TOM_GESTOR_LEADS_OAUTH_URL: "https://tom.test"
  }));
  return import("@lib/api/leads/tom");
};

describe("getTokenTomGestorLead", () => {
  beforeEach(() => {
    customFetchMock.mockReset();
  });

  it("returns access_token for prod", async () => {
    const { getTokenTomGestorLead } = await loadModule("prod");
    customFetchMock.mockResolvedValue({ access_token: "token-prod" });
    const res = await getTokenTomGestorLead();
    expect(res).toBe("token-prod");
  });

  it("returns data.access_token for non-prod", async () => {
    const { getTokenTomGestorLead } = await loadModule("dev");
    customFetchMock.mockResolvedValue({ data: { access_token: "token-dev" } });
    const res = await getTokenTomGestorLead();
    expect(res).toBe("token-dev");
  });

  it("throws when required constants are missing", async () => {
    jest.resetModules();
    jest.doMock("@lib/constants/constants", () => ({
      SST_STAGE: "dev",
      TOM_GESTOR_LEADS_CLIENT_GRANT_TYPE: "client_credentials",
      TOM_GESTOR_LEADS_CLIENT_ID: "",
      TOM_GESTOR_LEADS_CLIENT_SECRET: "",
      TOM_GESTOR_LEADS_OAUTH_URL: ""
    }));
    const { getTokenTomGestorLead } = await import("@lib/api/leads/tom");
    await expect(getTokenTomGestorLead()).rejects.toThrow();
  });
});
