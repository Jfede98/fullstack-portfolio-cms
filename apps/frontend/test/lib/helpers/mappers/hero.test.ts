import type { StrapiHero } from "@interfaces/components/hero";

const mockBuildWidget = jest.fn();

jest.mock("@lib/helpers/buildWidget", () => ({
  buildWidget: (...args: unknown[]) => mockBuildWidget(...args)
}));

jest.mock("@components/forms/contact/block", () => ({
  FormBlock: () => null
}));

describe("mapHero", () => {
  beforeEach(() => {
    jest.resetModules();
    mockBuildWidget.mockReset();
    mockBuildWidget.mockReturnValue(null);
    process.env.URL_STATIC_RESOURCES = "https://strapi.test";
  });

  it("returns default values when payload is empty", async () => {
    const { mapHero } = await import("@lib/helpers/mappers/hero");
    const result = mapHero({} as StrapiHero);

    expect(result).toEqual({
      slides: [],
      avatars: [],
      labels: [],
      widget: null,
      isFormWidget: false,
      showWidgetOnDesktop: false,
      horizontalFormOnDesktop: false,
      autoSlideDelayMs: 5000,
      variant: "default",
      ctaPosition: "side"
    });
    expect(mockBuildWidget).not.toHaveBeenCalled();
  });

  it("maps hero overlay lead form and slide lead forms", async () => {
    const { mapHero } = await import("@lib/helpers/mappers/hero");
    const result = mapHero({
      id: 99,
      heroOverlaySource: "lead_form",
      overlayLeadForm: {
        form: {
          title: "Hero Form",
          description: "Desc",
          inputs: [{ name: "phone", type: "tel", label: "Telefono" }]
        }
      },
      slides: [
        {
          id: 10,
          lead_form: {
            form: {
              title: "Slide 10",
              description: "D10",
              inputs: [{ name: "document", type: "text", label: "Cedula" }]
            }
          }
        },
        {
          id: 20,
          lead_form: {
            form: {
              title: "Slide 20",
              description: "D20",
              inputs: [{ name: "email", type: "email", label: "Correo" }]
            }
          }
        }
      ]
    } as StrapiHero);

    expect(result.widget).toBeTruthy();
    expect(result.slides[0].content.widget).toBeTruthy();
    expect(result.slides[1].content.widget).toBeTruthy();
    expect(mockBuildWidget).not.toHaveBeenCalled();
  });

  it("maps desktop/mobile banner images and enableOverlay variants", async () => {
    const { mapHero } = await import("@lib/helpers/mappers/hero");
    const result = mapHero({
      slides: [
        {
          id: 10,
          banner: {
            bannerDesktop: {
              img: { url: "/uploads/hero-desktop.png" },
              enabledOverlay: false
            },
            bannerMobile: {
              img: { url: "/uploads/hero-mobile.png" },
              enabledOverlay: true
            }
          }
        },
        {
          id: 20,
          banner: {
            bannerDesktop: {
              img: { url: "/uploads/hero-2-desktop.png" }
            },
            bannerMobile: {
              img: { url: "/uploads/hero-2-mobile.png" }
            }
          }
        }
      ]
    } as StrapiHero);

    expect(result.slides[0].content.backgroundImage).toEqual({
      desktop: "https://strapi.test/uploads/hero-desktop.png",
      mobile: "https://strapi.test/uploads/hero-mobile.png",
      enableOverlayDesktop: false,
      enableOverlayMobile: true
    });
    expect(result.slides[1].content.backgroundImage).toEqual({
      desktop: "https://strapi.test/uploads/hero-2-desktop.png",
      mobile: "https://strapi.test/uploads/hero-2-mobile.png",
      enableOverlayDesktop: true,
      enableOverlayMobile: true
    });
  });

  it("omits backgroundImage when banner is missing", async () => {
    const { mapHero } = await import("@lib/helpers/mappers/hero");
    const result = mapHero({
      slides: [
        {
          id: 10,
          banner: {
            bannerDesktop: { title: { text: "Sin banner" } }
          }
        }
      ]
    } as any);

    expect(result.slides[0].content.backgroundImage).toBeUndefined();
  });

  it("filters and maps features correctly", async () => {
    const { mapHero } = await import("@lib/helpers/mappers/hero");
    const result = mapHero({
      slides: [
        {
          id: 1,
          features: [
            { id: 1, icon: { name: "wifi" }, description: "D1", href: "/a" },
            { id: 2, name: "Nombre", description: "D2" },
            { id: 3, description: "Solo descripcion" },
            { id: 4, icon: { name: "" }, description: "" },
            { id: 5, icon: { name: "tv" } }
          ]
        }
      ]
    } as StrapiHero);

    expect(result.slides[0].content.features).toEqual([
      {
        name: "",
        text: "D1",
        href: undefined,
        identifier: undefined,
        leadFormSelection: undefined
      },
      {
        name: "",
        text: "D2",
        href: undefined,
        identifier: undefined,
        leadFormSelection: undefined
      },
      {
        name: "",
        text: "Solo descripcion",
        href: undefined,
        identifier: undefined,
        leadFormSelection: undefined
      }
    ]);
  });

  it("reads icon name from button.icon when feature.icon is absent", async () => {
    const { mapHero } = await import("@lib/helpers/mappers/hero");
    const result = mapHero({
      slides: [
        {
          id: 1,
          features: [
            {
              id: 90,
              description: "Descripcion features",
              button: {
                identifier: "simple",
                label: "Ejemplo del button",
                href: "/plans",
                icon: { id: 47, name: "home", type: "outlined", size: "sm" }
              }
            },
            {
              id: 89,
              description: "OTRO?",
              button: null
            }
          ]
        }
      ]
    } as StrapiHero);

    expect(result.slides[0].content.features).toEqual([
      { name: "home", text: "Descripcion features", href: "/plans", identifier: 2 },
      { name: "", text: "OTRO?", href: undefined }
    ]);
  });

  it("maps ctaButton by device from shared banner configs", async () => {
    const { mapHero } = await import("@lib/helpers/mappers/hero");
    const result = mapHero({
      slides: [
        {
          id: 1,
          banner: {
            bannerDesktop: {
              cta: {
                label: "Comprar",
                href: "/buy",
                type: "link",
                variant: "secondary",
                hasIcon: true,
                icon: { name: "arrow" }
              }
            },
            bannerMobile: {
              cta: {
                label: "Comprar mobile",
                href: "/buy-mobile",
                type: "link"
              }
            }
          }
        },
        {
          id: 2,
          banner: {
            bannerDesktop: {
              cta: { href: "/invalid-without-label" }
            }
          }
        }
      ]
    } as StrapiHero);

    expect(result.slides[0].content.ctaButton).toEqual({
      children: "Comprar",
      href: "/buy",
      type: "link",
      color: "secondary",
      icon: "arrow"
    });
    expect(result.slides[0].content.responsiveContent?.mobile.ctaButton).toEqual({
      children: "Comprar mobile",
      href: "/buy-mobile",
      type: "link",
      color: "primary"
    });
    expect(result.slides[1].content.ctaButton).toBeUndefined();
  });

  it("maps manual link data by device and suppresses ctaButton for hero slides", async () => {
    const { mapHero } = await import("@lib/helpers/mappers/hero");
    const result = mapHero({
      slides: [
        {
          id: 1,
          banner: {
            bannerDesktop: {
              useManualLink: true,
              link: "https://xtrim.ec/promo",
              isExternal: true,
              cta: { label: "No usar", href: "/ignored" }
            },
            bannerMobile: {
              useManualLink: true,
              link: "/promo-mobile",
              isExternal: false
            }
          }
        }
      ]
    } as StrapiHero);

    expect(result.slides[0].content.ctaButton).toBeUndefined();
    expect(result.slides[0].content.responsiveContent?.desktop).toEqual(
      expect.objectContaining({
        useManualLink: true,
        link: "https://xtrim.ec/promo",
        isExternal: true,
        ctaButton: undefined
      })
    );
    expect(result.slides[0].content.responsiveContent?.mobile).toEqual(
      expect.objectContaining({
        useManualLink: true,
        link: "/promo-mobile",
        isExternal: false,
        ctaButton: undefined
      })
    );
  });

  it("maps avatars, labels and hero flags", async () => {
    const { mapHero } = await import("@lib/helpers/mappers/hero");
    const result = mapHero({
      showWidgetOnDesktop: true,
      horizontalFormOnDesktop: true,
      slides: [
        {
          id: 10,
          navigationLabel: "Slide A",
          avatar: { url: "/uploads/avatar-a.png" }
        },
        {
          id: 20,
          navigationLabel: "Slide B",
          avatar: { url: "https://cdn.test/avatar-b.png" }
        },
        {
          id: 30
        }
      ]
    } as StrapiHero);

    expect(result.labels).toEqual(["Slide A", "Slide B", ""]);
    expect(result.avatars).toEqual([
      { src: "https://strapi.test/uploads/avatar-a.png" },
      { src: "https://cdn.test/avatar-b.png" }
    ]);
    expect(result.showWidgetOnDesktop).toBe(true);
    expect(result.horizontalFormOnDesktop).toBe(true);
  });

  it("maps hero overlay widget when source is widget", async () => {
    mockBuildWidget.mockReturnValueOnce("hero-overlay-widget");
    const { mapHero } = await import("@lib/helpers/mappers/hero");

    const result = mapHero({
      id: 77,
      heroOverlaySource: "widget",
      overlayWidget: [{ __component: "block.features" }],
      slides: [{ id: 1 }]
    } as unknown as StrapiHero);

    expect(result.widget).toBe("hero-overlay-widget");
    expect(result.isFormWidget).toBe(false);
    expect(mockBuildWidget).toHaveBeenCalledWith({
      block: { id: 77, widget: [{ __component: "block.features" }] },
      key: "widget-77"
    });
  });

  it("maps auto slide delay from hero block", async () => {
    const { mapHero } = await import("@lib/helpers/mappers/hero");
    const result = mapHero({
      autoSlideDelayMs: 1200,
      slides: [{ id: 1 }]
    } as any);

    expect(result.autoSlideDelayMs).toBe(1200);
  });

  it("maps ctaPosition per slide instead of applying the first configured slide to all", async () => {
    const { mapHero } = await import("@lib/helpers/mappers/hero");
    const result = mapHero({
      slides: [
        {
          id: 1,
          banner: {
            ctaPosition: "below",
            bannerDesktop: {
              cta: { label: "Slide 1", href: "/slide-1" }
            }
          }
        },
        {
          id: 2,
          banner: {
            ctaPosition: "side",
            bannerDesktop: {
              cta: { label: "Slide 2", href: "/slide-2" }
            }
          }
        },
        {
          id: 3,
          banner: {
            bannerDesktop: {
              cta: { label: "Slide 3", href: "/slide-3" }
            }
          }
        }
      ]
    } as StrapiHero);

    expect(result.ctaPosition).toBe("side");
    expect(result.slides[0].content.ctaPosition).toBe("below");
    expect(result.slides[1].content.ctaPosition).toBe("side");
    expect(result.slides[2].content.ctaPosition).toBe("below");
  });

  it("maps title/subtitle defaults from desktop config and widget presence", async () => {
    const { mapHero } = await import("@lib/helpers/mappers/hero");
    const result = mapHero({
      slides: [
        {
          id: 1,
          banner: {
            bannerDesktop: {}
          }
        },
        {
          id: 2,
          banner: {
            bannerDesktop: {}
          },
          lead_form: { documentId: "lf_2" }
        }
      ]
    } as StrapiHero);

    expect(result.slides[0].content.title).toEqual({ text: "", tag: undefined });
    expect(result.slides[0].content.subtitle).toEqual({
      text: "",
      tag: undefined
    });
    expect(result.slides[0].content.widget).toBeNull();
    expect(result.slides[1].content.widget).toBeNull();
  });
});
