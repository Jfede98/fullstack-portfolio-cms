import type { MetadataRoute } from "next";

jest.mock("@lib/helpers/sitemap", () => ({
  buildSiteMap: jest.fn(async () => [{ url: "https://xtrim.test" }])
}));

describe("sitemap", () => {
  it("returns sitemap entries", async () => {
    const sitemap = (await import("../../src/app/sitemap")).default;
    const result = (await sitemap()) as MetadataRoute.Sitemap;

    expect(result).toEqual([{ url: "https://xtrim.test" }]);
  });
});
