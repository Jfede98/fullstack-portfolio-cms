describe("robots", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  it("builds sitemap with https when base url has no protocol", async () => {
    process.env.SST_DOMAIN = "example.com";

    const robots = (await import("../../src/app/robots")).default;
    const result = robots();

    expect(result.sitemap).toBe("https://example.com/sitemap.xml");
    expect((result.rules as any)?.disallow).toEqual(["/api/", "/admin/"]);
  });

  it("keeps sitemap when base url already has protocol", async () => {
    process.env.SST_DOMAIN = "https://example.com";

    const robots = (await import("../../src/app/robots")).default;
    const result = robots();

    expect(result.sitemap).toBe("https://example.com/sitemap.xml");
  });

  it("throws when base url is missing", async () => {
    delete process.env.SST_DOMAIN;
    delete process.env.SITE_ORIGIN;

    const robots = (await import("../../src/app/robots")).default;
    expect(() => robots()).toThrow(
      "Robots configuration error: Neither SST_DOMAIN nor SITE_ORIGIN environment variables are configured."
    );
  });
});
