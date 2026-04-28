import { FetchingResponseType, RevalidateTags } from "@lib/constants/state";

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

jest.mock("@lib/constants/constants", () => ({
  STRAPI_BASE_URL: "https://strapi.test",
  STRAPI_ADMIN_TOKEN: "token-123",
  STRAPI_ORIGIN_HEADER: "origin.test",
  TOM_GESTOR_LEADS_OAUTH_URL: "https://tom.test"
}));

describe("fetch helpers", () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("fetchAdminToken adds auth headers and uses base url", async () => {
    const { fetchAdminToken } = await import("@lib/fetch");

    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ ok: true })
    });

    await fetchAdminToken("api/test", { method: "GET" });

    expect(fetchMock).toHaveBeenCalledWith("https://strapi.test/api/test", {
      method: "GET",
      headers: {
        Authorization: "Bearer token-123",
        Origin: "origin.test"
      },
      next: {
        tags: [RevalidateTags.ALL]
      }
    });
  });

  it("fetchLeadsTom throws when token or base url missing", async () => {
    const { fetchLeadsTom } = await import("@lib/fetch");

    await expect(fetchLeadsTom({} as any)).rejects.toThrow(
      "TOM_GESTOR_LEADS_OAUTH_URL not found"
    );
  });

  it("fetchLeadsTom returns status and body", async () => {
    const { fetchLeadsTom } = await import("@lib/fetch");

    fetchMock.mockResolvedValueOnce({
      status: 201,
      text: jest.fn().mockResolvedValue("ok")
    });

    const res = await fetchLeadsTom({
      token: "Bearer abc",
      method: "POST",
      body: "{}"
    });

    expect(res).toEqual({ status: 201, body: "ok" });
    expect(fetchMock).toHaveBeenCalledWith("https://tom.test/lead/lead", {
      method: "POST",
      body: "{}",
      headers: {
        Authorization: "Bearer abc",
        "Content-Type": "application/json"
      },
      next: { tags: [RevalidateTags.ALL] },
      token: "Bearer abc"
    });
  });

  it("customFetch supports json and text responses", async () => {
    const { customFetch } = await import("@lib/fetch");

    fetchMock
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ ok: true })
      })
      .mockResolvedValueOnce({
        text: jest.fn().mockResolvedValue("plain")
      });

    const jsonRes = await customFetch("https://x.test", {
      typeResponse: FetchingResponseType.JSON
    });
    const textRes = await customFetch("https://y.test", {
      typeResponse: FetchingResponseType.TEXT
    });

    expect(jsonRes).toEqual({ ok: true });
    expect(textRes).toBe("plain");
  });

  it("customFetch rethrows fetch errors", async () => {
    const { customFetch } = await import("@lib/fetch");
    fetchMock.mockRejectedValueOnce(new Error("fail"));
    await expect(customFetch("https://z.test", {} as any)).rejects.toThrow("fail");
  });
});
