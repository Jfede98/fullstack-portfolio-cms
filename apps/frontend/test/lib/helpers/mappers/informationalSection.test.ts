describe("mapInformationalSection", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.URL_STATIC_RESOURCES = "https://strapi.test";
  });

  it("maps informational section data with all fields", async () => {
    const { mapInformationalSection } = await import(
      "@lib/helpers/mappers/informationalSection"
    );
    const result = mapInformationalSection({
      title: { id: 292, text: "Titulo", tag: "h3" },
      subtitle: { id: 295, text: "Subtitulo hfc", tag: "h5" },
      description: "Esto es mucho texto",
      button: {
        label: "Acción",
        href: null,
        type: "button",
        variant: "primary",
        hasIcon: false,
        identifier: "modal",
        isExternalHref: false,
        icon: null
      },
      image: {
        id: 88,
        url: "/uploads/test_banner_slide.jpg",
        alternativeText: "Test banner"
      }
    } as any);

    expect(result.title).toEqual({ text: "Titulo", tag: "h3" });
    expect(result.subtitle).toEqual({ text: "Subtitulo hfc", tag: "h5" });
    expect(result.description).toBe("Esto es mucho texto");
    expect(result.cta).toEqual({
      children: "Acción",
      href: undefined,
      type: "button",
      color: "primary",
      icon: undefined,
      identifier: 0,
      leadFormSelection: undefined
    });
    expect(result.image).toEqual({
      src: "https://strapi.test/uploads/test_banner_slide.jpg",
      alt: "Test banner"
    });
  });

  it("handles missing subtitle and description", async () => {
    const { mapInformationalSection } = await import(
      "@lib/helpers/mappers/informationalSection"
    );
    const result = mapInformationalSection({
      title: { id: 1, text: "Solo titulo", tag: "h2" },
      subtitle: undefined,
      description: undefined,
      button: {
        label: "Click",
        variant: "secondary"
      },
      image: {
        id: 99,
        url: "/image.jpg"
      }
    } as any);

    expect(result.title).toEqual({ text: "Solo titulo", tag: "h2" });
    expect(result.subtitle).toBeUndefined();
    expect(result.description).toBe("");
    expect(result.image.alt).toBe("");
  });

  it("handles missing title text with fallback", async () => {
    const { mapInformationalSection } = await import(
      "@lib/helpers/mappers/informationalSection"
    );
    const result = mapInformationalSection({
      title: { id: 1, text: "", tag: "h2" },
      button: { label: "Test" },
      image: { url: "/test.jpg" }
    } as any);

    expect(result.title).toEqual({ text: "" });
  });

  it("handles missing button with fallback", async () => {
    const { mapInformationalSection } = await import(
      "@lib/helpers/mappers/informationalSection"
    );
    const result = mapInformationalSection({
      title: { id: 1, text: "Test", tag: "h2" },
      button: { label: undefined },
      image: { url: "/test.jpg" }
    } as any);

    expect(result.cta).toBeUndefined();
  });

  it("handles missing image URL with fallback", async () => {
    const { mapInformationalSection } = await import(
      "@lib/helpers/mappers/informationalSection"
    );
    const result = mapInformationalSection({
      title: { id: 1, text: "Test", tag: "h2" },
      button: { label: "Action" },
      image: { url: null }
    } as any);

    expect(result.image.src).toBe("https://strapi.test");
  });
});




