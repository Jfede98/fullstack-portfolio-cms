describe("mappers utils", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.URL_STATIC_RESOURCES = "https://strapi.test";
  });

  it("maps icon fields", async () => {
    const { mapIcon } = await import("@lib/helpers/mappers/utils");
    expect(
      mapIcon({ name: "star", size: "lg", type: "outline" } as any)
    ).toEqual({
      name: "star",
      size: "lg",
      type: "outline"
    });
  });

  it("maps icon defaults when fields are missing", async () => {
    const { mapIcon } = await import("@lib/helpers/mappers/utils");
    expect(mapIcon(undefined)).toEqual({
      name: "",
      size: "msm",
      type: "outlined"
    });
  });

  it("maps media url with base", async () => {
    const { mapUrlMedia } = await import("@lib/helpers/mappers/utils");
    expect(
      mapUrlMedia({ url: "/uploads/file.png" } as any)
    ).toBe("https://strapi.test/uploads/file.png");
  });

  it("returns absolute media url unchanged", async () => {
    const { mapUrlMedia } = await import("@lib/helpers/mappers/utils");
    expect(
      mapUrlMedia({ url: "https://cdn.test/file.png" } as any)
    ).toBe("https://cdn.test/file.png");
  });

  it("returns undefined when media is null", async () => {
    const { mapUrlMedia } = await import("@lib/helpers/mappers/utils");
    expect(mapUrlMedia(null)).toBeUndefined();
  });
});
