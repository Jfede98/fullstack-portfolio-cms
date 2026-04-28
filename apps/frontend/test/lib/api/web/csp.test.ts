const fetchAdminToken = jest.fn();
const fetchMock = jest.fn();

global.fetch = fetchMock as unknown as typeof fetch;

jest.mock("@lib/fetch", () => ({
  fetchAdminToken: (...args: unknown[]) => fetchAdminToken(...args)
}));

describe("getContentSecurityPolicy", () => {
  const originalStaticUrl = process.env.URL_STATIC_RESOURCES;
  const originalStaticRoot = process.env.AWS_S3_ROOT_PATH;

  beforeEach(() => {
    jest.resetModules();
    fetchAdminToken.mockReset();
    fetchMock.mockReset();
    process.env.URL_STATIC_RESOURCES = "https://statics.test";
    process.env.AWS_S3_ROOT_PATH = "assets-admin-xtrim";
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    if (originalStaticUrl === undefined) {
      delete process.env.URL_STATIC_RESOURCES;
    } else {
      process.env.URL_STATIC_RESOURCES = originalStaticUrl;
    }

    if (originalStaticRoot === undefined) {
      delete process.env.AWS_S3_ROOT_PATH;
    } else {
      process.env.AWS_S3_ROOT_PATH = originalStaticRoot;
    }
  });

  it("returns csp payload from static storage first", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        csp: {
          "default-src": ["'self'", "https:"]
        }
      })
    });

    const { getContentSecurityPolicy } = await import("@lib/api/web/csp");
    const result = await getContentSecurityPolicy();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://statics.test/assets-admin-xtrim/csp.json",
      {
        cache: "force-cache",
        next: {
          revalidate: 0,
          tags: ["csp", "all"]
        }
      }
    );
    expect(fetchAdminToken).not.toHaveBeenCalled();
    expect(result).toEqual({ "default-src": ["'self'", "https:"] });
  });

  it("falls back to strapi when static storage is unavailable", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404 });
    fetchAdminToken.mockResolvedValue({
      data: {
        csp: {
          "default-src": ["'self'"]
        }
      }
    });

    const { getContentSecurityPolicy } = await import("@lib/api/web/csp");
    const result = await getContentSecurityPolicy();

    expect(fetchAdminToken).toHaveBeenCalledWith("api/content-security-policy", {
      next: {
        revalidate: 0,
        tags: ["csp"]
      }
    });
    expect(result).toEqual({ "default-src": ["'self'"] });
  });

  it("falls back to strapi when static fetch throws", async () => {
    fetchMock.mockRejectedValue(new Error("network error"));
    fetchAdminToken.mockResolvedValue({
      data: {
        csp: {
          "script-src": ["'self'"]
        }
      }
    });

    const { getContentSecurityPolicy } = await import("@lib/api/web/csp");
    const result = await getContentSecurityPolicy();

    expect(fetchAdminToken).toHaveBeenCalledWith("api/content-security-policy", {
      next: {
        revalidate: 0,
        tags: ["csp"]
      }
    });
    expect(result).toEqual({ "script-src": ["'self'"] });
  });

  it("falls back to strapi when static env is missing", async () => {
    delete process.env.URL_STATIC_RESOURCES;
    delete process.env.AWS_S3_ROOT_PATH;

    fetchAdminToken.mockResolvedValue({
      data: {
        csp: {
          "img-src": ["'self'", "data:"]
        }
      }
    });

    const { getContentSecurityPolicy } = await import("@lib/api/web/csp");
    const result = await getContentSecurityPolicy();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(fetchAdminToken).toHaveBeenCalledWith("api/content-security-policy", {
      next: {
        revalidate: 0,
        tags: ["csp"]
      }
    });
    expect(result).toEqual({ "img-src": ["'self'", "data:"] });
  });

  it("falls back to strapi when static payload is invalid", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        csp: {
          "default-src": "self"
        }
      })
    });

    fetchAdminToken.mockResolvedValue({
      data: {
        csp: {
          "default-src": ["'self'"]
        }
      }
    });

    const { getContentSecurityPolicy } = await import("@lib/api/web/csp");
    const result = await getContentSecurityPolicy();

    expect(fetchAdminToken).toHaveBeenCalled();
    expect(result).toEqual({ "default-src": ["'self'"] });
  });

  it("skips static retries for 60s after a static failure", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 403 });
    fetchAdminToken.mockResolvedValue({
      data: {
        csp: {
          "default-src": ["'self'"]
        }
      }
    });

    const { getContentSecurityPolicy } = await import("@lib/api/web/csp");

    const first = await getContentSecurityPolicy();
    const second = await getContentSecurityPolicy();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchAdminToken).toHaveBeenCalledTimes(2);
    expect(first).toEqual({ "default-src": ["'self'"] });
    expect(second).toEqual({ "default-src": ["'self'"] });
  });

  it("throws when static and strapi sources are both invalid", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });
    fetchAdminToken.mockResolvedValue({ data: { csp: { "default-src": "self" } } });

    const { getContentSecurityPolicy } = await import("@lib/api/web/csp");

    await expect(getContentSecurityPolicy()).rejects.toThrow(
      "Invalid CSP payload: no valid directives found."
    );
  });
});
