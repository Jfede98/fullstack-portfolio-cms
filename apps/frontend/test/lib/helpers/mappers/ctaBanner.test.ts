describe("mapCtaBanner", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.URL_STATIC_RESOURCES = "https://strapi.test";
  });

  it("maps CTA banner data and filters features without icon", async () => {
    const { mapCtaBanner } = await import("@lib/helpers/mappers/ctaBanner");
    const result = mapCtaBanner({
      title: { text: "Titulo", tag: "h2" },
      description: "Desc",
      cta: { label: "Ver", href: "/go", type: "link" },
      backgroundImage: { url: "/uploads/img.png" },
      features: [
        { name: "F1", icon: { name: "wifi" }, description: "A" },
        { name: "F2", icon: null, description: "B" }
      ]
    } as any);

    expect(result.title).toEqual({ text: "Titulo", tag: "h2" });
    expect(result.subtitle).toBe("Desc");
    expect(result.button).toEqual(
      expect.objectContaining({
        children: "Ver",
        href: "/go",
        type: "link",
        color: "primary"
      })
    );
    expect(result.backgroundImage).toBe("https://strapi.test/assets-admin-xtrim/img.png");
    expect(result.features).toEqual([{ iconName: "wifi", text: "A" }]);
  });

  it("accepts icon array format", async () => {
    const { mapCtaBanner } = await import("@lib/helpers/mappers/ctaBanner");
    const result = mapCtaBanner({
      features: [
        { icon: [{ name: "bolt" }], description: "Rapido" }
      ]
    } as any);

    expect(result.features).toEqual([{ iconName: "bolt", text: "Rapido" }]);
  });

  it("handles empty fields and mappings gracefully", async () => {
    const { mapCtaBanner } = await import("@lib/helpers/mappers/ctaBanner");
    const result = mapCtaBanner({} as any);
    expect(result.button).toBeUndefined();
    expect(result.features).toEqual([]);
    expect(result.backgroundImage).toBe("");
  });
});
