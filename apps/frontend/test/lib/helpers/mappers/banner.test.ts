describe("mapSharedBanner", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.URL_STATIC_RESOURCES = "https://strapi.test";
  });

  it("maps ctaButton when manual link is disabled", async () => {
    const { mapSharedBanner } = await import("@lib/helpers/mappers/banner");

    const result = mapSharedBanner({
      bannerDesktop: {
        useManualLink: false,
        link: "/ignored",
        isExternal: true,
        cta: {
          label: "Comprar",
          href: "/comprar",
          type: "link",
          variant: "secondary"
        }
      }
    } as any);

    expect(result.desktop).toEqual(
      expect.objectContaining({
        useManualLink: false,
        link: undefined,
        isExternal: false,
        ctaButton: expect.objectContaining({
          children: "Comprar",
          href: "/comprar",
          type: "link",
          color: "secondary"
        })
      })
    );
  });

  it("maps manual link and omits ctaButton when manual link is enabled", async () => {
    const { mapSharedBanner } = await import("@lib/helpers/mappers/banner");

    const result = mapSharedBanner({
      bannerDesktop: {
        useManualLink: true,
        link: "https://xtrim.ec/promo",
        isExternal: true,
        cta: {
          label: "No usar",
          href: "/ignored",
          type: "link"
        }
      }
    } as any);

    expect(result.desktop).toEqual(
      expect.objectContaining({
        useManualLink: true,
        link: "https://xtrim.ec/promo",
        isExternal: true,
        ctaButton: undefined
      })
    );
  });
});

