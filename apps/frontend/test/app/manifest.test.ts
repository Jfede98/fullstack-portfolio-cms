import manifest from "../../src/app/manifest";

describe("manifest", () => {
  it("returns expected manifest shape", () => {
    const result = manifest();

    expect(result.name).toBe("xtrim");
    expect(result.short_name).toBe("xtrim");
    expect(result.start_url).toBe("/");
    expect(result.icons).toHaveLength(4);
    expect(result.icons?.[0]).toEqual(
      expect.objectContaining({
        src: "/seo/icon-192x192.png",
        type: "image/png"
      })
    );
  });
});
