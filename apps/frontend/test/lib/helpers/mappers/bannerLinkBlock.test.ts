describe("mapBannerLinkBlock", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.URL_STATIC_RESOURCES = "https://strapi.test";
  });

  it("uses manual link from shared banner config", async () => {
    const { mapBannerLinkBlock } = await import(
      "@lib/helpers/mappers/bannerLinkBlock"
    );

    const result = mapBannerLinkBlock({
      banner: {
        bannerDesktop: {
          img: { url: "/uploads/desktop.png" },
          useManualLink: true,
          link: "https://xtrim.ec/promo",
          isExternal: true,
          cta: { label: "No usar", href: "/ignored" }
        },
        bannerMobile: {
          img: { url: "/uploads/mobile.png" },
          useManualLink: true,
          link: "/promo-mobile",
          isExternal: false
        }
      }
    } as any);

    expect(result.banners[0]).toEqual(
      expect.objectContaining({
        link: "https://xtrim.ec/promo",
        isExternal: true,
        desktop: expect.objectContaining({
          image: "https://strapi.test/uploads/desktop.png",
          useManualLink: true,
          link: "https://xtrim.ec/promo",
          isExternal: true,
          ctaButton: undefined
        }),
        mobile: expect.objectContaining({
          image: "https://strapi.test/uploads/mobile.png",
          useManualLink: true,
          link: "/promo-mobile",
          isExternal: false,
          ctaButton: undefined
        })
      })
    );
  });

  it("does not use block-level link when config has no manual link", async () => {
    const { mapBannerLinkBlock } = await import(
      "@lib/helpers/mappers/bannerLinkBlock"
    );

    const result = mapBannerLinkBlock({
      banner: {
        bannerDesktop: {
          img: { url: "/uploads/desktop.png" },
          cta: { label: "Comprar", href: "/comprar" }
        }
      }
    } as any);

    expect(result.banners[0]).toEqual(
      expect.objectContaining({
        link: undefined,
        isExternal: false,
        desktop: expect.objectContaining({
          ctaButton: expect.objectContaining({
            children: "Comprar",
            href: "/comprar"
          }),
          link: undefined,
          isExternal: false
        })
      })
    );
  });

  it("supports repeatable lowercase banner entries from Strapi", async () => {
    const { mapBannerLinkBlock } = await import(
      "@lib/helpers/mappers/bannerLinkBlock"
    );

    const result = mapBannerLinkBlock({
      banner: [
        {
          bannerDesktop: {
            img: { url: "/uploads/one.png" },
            useManualLink: true,
            link: "/one"
          }
        },
        {
          bannerDesktop: {
            img: { url: "/uploads/two.png" },
            useManualLink: true,
            link: "/two"
          }
        }
      ]
    } as any);

    expect(result.banners).toHaveLength(2);
    expect(result.banners[0]).toEqual(
      expect.objectContaining({
        link: "/one",
        desktop: expect.objectContaining({
          image: "https://strapi.test/uploads/one.png"
        })
      })
    );
    expect(result.banners[1]).toEqual(
      expect.objectContaining({
        link: "/two",
        desktop: expect.objectContaining({
          image: "https://strapi.test/uploads/two.png"
        })
      })
    );
  });

  it("supports expected capitalized Banner array according to Strapi type", async () => {
    const { mapBannerLinkBlock } = await import(
      "@lib/helpers/mappers/bannerLinkBlock"
    );

    const result = mapBannerLinkBlock({
      Banner: [
        {
          banner: {
            bannerDesktop: { img: { url: "/uploads/capitalized.png" } }
          }
        }
      ]
    } as any);

    expect(result.banners).toHaveLength(1);
    expect(result.banners[0].desktop.image).toBe("https://strapi.test/uploads/capitalized.png");
  });

  it("handles empty object properly to avoid breaking", async () => {
    const { mapBannerLinkBlock } = await import(
      "@lib/helpers/mappers/bannerLinkBlock"
    );

    const result = mapBannerLinkBlock({} as any);
    expect(result.banners).toEqual([]);
  });
});
