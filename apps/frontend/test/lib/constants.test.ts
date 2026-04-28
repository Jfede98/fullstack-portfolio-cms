describe("constants", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  it("uses SST_DOMAIN for sitemap base when present", async () => {
    process.env.SST_DOMAIN = "https://sst.example";
    process.env.SITE_ORIGIN = "https://site.example";

    const constants = await import("@lib/constants/constants");
    expect(constants.SITEMAP_BASE_URL).toBe("https://sst.example");
  });

  it("falls back to SITE_ORIGIN when SST_DOMAIN is missing", async () => {
    delete process.env.SST_DOMAIN;
    process.env.SITE_ORIGIN = "https://site.example";

    const constants = await import("@lib/constants/constants");
    expect(constants.SITEMAP_BASE_URL).toBe("https://site.example");
  });

  it("exposes default values and gtm event", async () => {
    (process.env as any).NODE_ENV = "production";
    const constants = await import("@lib/constants/constants");
    // TODO: configure revalidation time via environment variables
    // const isProduction = process.env.NODE_ENV === "production";
    // const time = isProduction ? 262800 : 0;
    const time = 262800;

    expect(constants.REVALIDATE_API).toBe(time);
    expect(constants.REVALIDATE_MENU_API).toBe(time);
    expect(constants.SITEMAP_REVALIDATE_API).toBe(time);
    expect(constants.DEFAULT_GTM_EVENT).toEqual(
      expect.objectContaining({
        em: "xtriminvitado@xtrim.com.ec",
        ph: "593986911813",
        country: "ec"
      })
    );
  });

  it("defaults stage to development when NODE_ENV is undefined", async () => {
    delete (process.env as any).NODE_ENV;
    const constants = await import("@lib/constants/constants");
    expect(constants.STAGE).toBe("development");
  });

  it("maps env driven constants", async () => {
    process.env.STRAPI_API_URL = "https://cms.test";
    process.env.STRAPI_ORIGIN_HEADER = "https://origin.test";
    process.env.GOOGLE_TAG_MANAGER_ID = "GTM-TEST";
    process.env.STRAPI_ADMIN_TOKEN = "token";
    process.env.URL_STATIC_RESOURCES = "https://cdn.test";
    process.env.SITE_ORIGIN = "https://site.test";
    process.env.TOM_GESTOR_LEADS_OAUTH_URL = "https://tom.test";
    process.env.TOM_GESTOR_LEADS_CLIENT_ID = "client-id";
    process.env.TOM_GESTOR_LEADS_CLIENT_SECRET = "client-secret";

    const constants = await import("@lib/constants/constants");

    expect(constants.STRAPI_BASE_URL).toBe("https://cms.test");
    expect(constants.STRAPI_ORIGIN_HEADER).toBe("https://origin.test");
    expect(constants.GTM_ID).toBe("GTM-TEST");
    expect(constants.STRAPI_ADMIN_TOKEN).toBe("token");
    expect(constants.URL_STATIC_RESOURCES).toBe("https://cdn.test");
    expect(constants.SITE_ORIGIN).toBe("https://site.test");
    expect(constants.TOM_GESTOR_LEADS_OAUTH_URL).toBe("https://tom.test");
    expect(constants.TOM_GESTOR_LEADS_CLIENT_ID).toBe("client-id");
    expect(constants.TOM_GESTOR_LEADS_CLIENT_SECRET).toBe("client-secret");
    expect(constants.TOM_GESTOR_LEADS_CLIENT_GRANT_TYPE).toBe("client_credentials");
    expect(constants.HOME_POPULATE_LEVEL).toBe(7);
  });
});
