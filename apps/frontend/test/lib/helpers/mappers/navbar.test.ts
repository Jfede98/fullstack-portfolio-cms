jest.mock("@components/offerCard", () => ({
  OfferNavbarCard: () => null
}));

describe("mapNavbar", () => {
  beforeEach(() => {
    process.env.URL_STATIC_RESOURCES = "https://cdn.test";
  });

  it("maps contact button through shared button mapper with simple identifier", async () => {
    const { mapNavbar } = await import("@lib/helpers/mappers/navbar");

    const result = await mapNavbar({
      logo: { url: "/logo.png", caption: "Logo" },
      loginButton: { label: "Ingresar", href: "/login", isExternal: false },
      ctaButton: {
        label: "Contactar",
        href: "/contacto",
        type: "button",
        variant: "secondary",
        hasIcon: false,
        identifier: "simple",
      },
      topNavigation: [],
      menuItems: [],
    } as any);

    expect(result.buttonContact).toEqual(
      expect.objectContaining({
        children: "Contactar",
        href: "/contacto",
        type: "button",
        color: "secondary",
        identifier: 2,
      })
    );
  });

  it("maps simple/list/cards menu variants with proper links and children", async () => {
    const { mapNavbar } = await import("@lib/helpers/mappers/navbar");

    const result = await mapNavbar({
      logo: { url: "/uploads/logo.png", caption: "Logo" },
      loginButton: {
        label: "Ingresar",
        href: "/login",
        isExternal: true,
        icon: { name: "user" }
      },
      ctaButton: {
        label: "Contactar",
        href: null,
        type: "button",
        variant: "primary",
        hasIcon: false,
        identifier: "simple",
      },
      topNavigation: [
        { label: "Top 1", href: "/top-1", isExternal: false, icon: null },
        { label: "Top 2", href: "/top-2", isExternal: true, icon: null }
      ],
      menuItems: [
        {
          label: "Simple",
          type: "simple",
          href: "/simple",
          isExternal: false
        },
        {
          label: "List",
          type: "list",
          menuItems: [
            { label: "A", href: "/a", isExternal: false },
            { label: "B", href: "/b", isExternal: true }
          ]
        },
        {
          label: "Cards",
          type: "cards",
          titleCards: "Promos",
          promoCards: [
            {
              title: "Promo 1",
              subtitle: "Sub",
              price: 10,
              href: "/promo-1",
              titleHref: "Ver",
              image: { url: "/promo-1.png", caption: "promo" }
            }
          ]
        }
      ]
    } as any);

    expect(result.logo).toEqual(
      expect.objectContaining({
        src: "https://cdn.test/uploads/logo.png",
        alt: "Logo"
      })
    );
    expect(result.sessionLink).toEqual(
      expect.objectContaining({
        target: "_blank"
      })
    );
    expect(result.buttonContact?.href).toBe("#");
    expect(result.navbarTop?.[0]).toEqual(
      expect.objectContaining({ href: "/top-1", target: "_self" })
    );
    expect(result.navbarTop?.[1]).toEqual(
      expect.objectContaining({ href: "/top-2", target: "_blank" })
    );

    expect(result.links?.[0]).toEqual(
      expect.objectContaining({
        label: "Simple",
        link: { href: "/simple", target: "_self" }
      })
    );
    expect(result.links?.[1]).toEqual(
      expect.objectContaining({
        label: "List",
        links: [
          expect.objectContaining({ href: "/a", target: "_self" }),
          expect.objectContaining({ href: "/b", target: "_blank" })
        ]
      })
    );
    expect(result.links?.[2]).toEqual(
      expect.objectContaining({
        label: "Cards",
        children: expect.anything()
      })
    );
  });

  it("uses fallbacks when href/logo are missing", async () => {
    const { mapNavbar } = await import("@lib/helpers/mappers/navbar");

    const result = await mapNavbar({
      logo: { url: null, caption: null },
      loginButton: { label: "Ingresar", href: null, isExternal: false, icon: null },
      ctaButton: {
        label: "Contacto",
        href: null,
        type: "button",
        variant: "secondary",
        hasIcon: false,
        identifier: "simple",
      },
      topNavigation: [{ label: "Top", href: null, isExternal: false, icon: null }],
      menuItems: [
        { label: "Simple sin href", type: "simple", href: null, isExternal: false }
      ]
    } as any);

    expect(result.logo).toEqual(
      expect.objectContaining({
        alt: "Logo"
      })
    );
    expect(result.sessionLink).toEqual(
      expect.objectContaining({
        href: "#",
        target: "_self"
      })
    );
    expect(result.navbarTop?.[0]).toEqual(
      expect.objectContaining({
        href: "",
        target: "_self"
      })
    );
    expect(result.links?.[0]).toEqual(
      expect.objectContaining({
        link: undefined
      })
    );
  });

  it("maps modal navbar button with lead form selection", async () => {
    const { mapNavbar } = await import("@lib/helpers/mappers/navbar");

    const result = await mapNavbar({
      logo: { url: "/logo.png", caption: "Logo" },
      loginButton: { label: "Ingresar", href: "/login", isExternal: false },
      ctaButton: {
        label: "Contratar",
        href: null,
        type: "button",
        variant: "primary",
        hasIcon: false,
        identifier: "modal",
        lead_form: {
          documentId: "lf_1",
          name: "Formulario Navbar",
          form: {
            title: "Formulario",
            description: "Desc",
            inputs: [{ name: "telefono", type: "tel", label: "Telefono" }],
            button: { label: "Enviar", identifier: "simple" }
          },
          lead_routing_configs: [
            { documentId: "rc_1", distributionMode: "email", isActive: true }
          ]
        }
      },
      topNavigation: [],
      menuItems: [],
    } as any);

    expect(result.buttonContact).toEqual(
      expect.objectContaining({
        children: "Contratar",
        identifier: 0,
        leadFormSelection: expect.objectContaining({
          leadFormDocumentId: "lf_1",
          routingConfigDocumentId: "rc_1",
          distributionMode: "email"
        })
      })
    );
  });

  it("returns undefined contact button when cta is invalid", async () => {
    const { mapNavbar } = await import("@lib/helpers/mappers/navbar");

    const result = await mapNavbar({
      logo: { url: "/logo.png", caption: "Logo" },
      loginButton: { label: "Ingresar", href: "/login", isExternal: false },
      ctaButton: {
        label: null,
        href: "/contacto",
        type: "button",
        variant: "primary",
        hasIcon: false,
        identifier: "simple"
      },
      topNavigation: [],
      menuItems: []
    } as any);

    expect(result.buttonContact).toBeUndefined();
  });

  it("maps menu icon/list and cards fallbacks", async () => {
    const { mapNavbar } = await import("@lib/helpers/mappers/navbar");

    const result = await mapNavbar({
      logo: { url: "/logo.png", caption: "Logo" },
      loginButton: { label: "Ingresar", href: "/login", isExternal: false },
      ctaButton: {
        label: "Contacto",
        href: "/contacto",
        type: "button",
        variant: "primary",
        hasIcon: false,
        identifier: "simple"
      },
      topNavigation: [],
      menuItems: [
        {
          label: "SimpleExt",
          type: "simple",
          href: "/simple-ext",
          isExternal: true
        },
        {
          label: "ListWithIcon",
          type: "list",
          menuItems: [
            {
              label: "Con icono",
              href: "/icono",
              isExternal: false,
              icon: { name: "wifi" }
            }
          ]
        },
        {
          label: "CardsFallback",
          type: "cards",
          titleCards: "Promos",
          promoCards: [
            {
              title: "Promo Fallback",
              subtitle: "Sub",
              price: 9.9,
              href: null,
              titleHref: "Ver",
              image: { url: "/promo.png", caption: null }
            }
          ]
        }
      ]
    } as any);

    expect(result.links?.[0]).toEqual(
      expect.objectContaining({
        link: { href: "/simple-ext", target: "_blank" }
      })
    );
    expect(result.links?.[1].links?.[0]).toEqual(
      expect.objectContaining({
        icon: expect.anything()
      })
    );
    expect(result.links?.[2]).toEqual(
      expect.objectContaining({
        children: expect.anything()
      })
    );
  });

  it("applies list href/target defaults and cards fallback with empty promo array", async () => {
    const { mapNavbar } = await import("@lib/helpers/mappers/navbar");

    const result = await mapNavbar({
      logo: { url: "/logo.png", caption: "Logo" },
      loginButton: { label: "Ingresar", href: "/login", isExternal: false },
      ctaButton: {
        label: "Contacto",
        href: "/contacto",
        type: "button",
        variant: "primary",
        hasIcon: false,
        identifier: "simple"
      },
      topNavigation: [],
      menuItems: [
        {
          label: "ListDefaults",
          type: "list",
          menuItems: [{ label: "Sin href ni external" }]
        },
        {
          label: "CardsNoPromos",
          type: "cards",
          promoCards: undefined
        }
      ]
    } as any);

    expect(result.links?.[0].links?.[0]).toEqual(
      expect.objectContaining({
        href: "#",
        target: "_self"
      })
    );
    expect(result.links?.[1]).toEqual(
      expect.objectContaining({
        children: expect.anything()
      })
    );
  });
});
