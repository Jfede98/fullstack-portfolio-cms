import { mapStreamingPlans } from "@lib/helpers/mappers/streamingPlans";

describe("mapStreamingPlans", () => {
  it("maps streaming plans block with complete data", () => {
    const result = mapStreamingPlans({
      id: 1,
      title: { text: "Nuestros Planes de Streaming", tag: "h2" },
      subtitle: { text: "Encuentra el plan perfecto para ti", tag: "p" },
      plans: [
        {
          id: 1,
          title: "Zapping Premium",
          description: "Disfruta de todos tus canales favoritos",
          badgeText: "Nuevo",
          image: {
            url: "",
            alternativeText: "Zapping Premium"
          },
          ctas: [
            {
              label: "Contratar ahora",
              href: "/planes/zapping",
              type: "primary",
              variant: "primary",
              hasIcon: false
            },
            {
              label: "Más información",
              href: "/info/zapping",
              type: "secondary",
              variant: "outline",
              hasIcon: true,
              icon: { name: "info" }
            }
          ]
        },
        {
          id: 2,
          title: "Paramount+",
          description: "Todo el contenido de Paramount",
          badgeText: null,
          image: {
            url: "",
            alternativeText: "Paramount+"
          },
          ctas: [
            {
              label: "Ver planes",
              href: "/planes/paramount",
              type: "link",
              variant: "link",
              hasIcon: false
            }
          ]
        }
      ]
    } as any);

    expect(result).toEqual({
      title: { text: "Nuestros Planes de Streaming", tag: "h2" },
      subtitle: { text: "Encuentra el plan perfecto para ti", tag: "p" },
      plans: [
        {
          title: "Zapping Premium",
          description: "Disfruta de todos tus canales favoritos",
          badgeText: "Nuevo",
          image: {
            src: "",
            alt: "Zapping Premium"
          },
          ctas: [
            {
              label: "Contratar ahora",
              href: "/planes/zapping",
              type: "primary",
              color: "primary",
              icon: undefined,
              identifier: 2,
              target: undefined,
              leadFormSelection: undefined
            },
            {
              label: "Más información",
              href: "/info/zapping",
              type: "secondary",
              color: "outline",
              icon: "info",
              identifier: 2,
              target: undefined,
              leadFormSelection: undefined
            }
          ]
        },
        {
          title: "Paramount+",
          description: "Todo el contenido de Paramount",
          badgeText: undefined,
          image: {
            src: "",
            alt: "Paramount+"
          },
          ctas: [
            {
              label: "Ver planes",
              href: "/planes/paramount",
              type: "link",
              color: "primary",
              icon: undefined,
              identifier: 2,
              target: undefined,
              leadFormSelection: undefined
            }
          ]
        }
      ]
    });
  });

  it("handles missing or null values gracefully", () => {
    const result = mapStreamingPlans({
      plans: [
        {
          title: null,
          description: null,
          badgeText: null,
          image: null,
          ctas: null
        },
        {
          title: "Plan básico",
          description: undefined,
          image: { url: null },
          ctas: []
        }
      ]
    } as any);

    expect(result.title).toBeUndefined();
    expect(result.subtitle).toBeUndefined();
    expect(result.plans).toHaveLength(2);
    expect(result.plans[0].title).toBe("");
    expect(result.plans[0].description).toBe("");
    expect(result.plans[0].image.src).toBe("");
    expect(result.plans[0].ctas).toEqual([]);
  });

  it("maps plans without title or subtitle", () => {
    const result = mapStreamingPlans({
      plans: [
        {
          title: "Plan Test",
          description: "Descripción de prueba",
          image: { url: "" },
          ctas: []
        }
      ]
    } as any);

    expect(result.title).toBeUndefined();
    expect(result.subtitle).toBeUndefined();
    expect(result.plans).toHaveLength(1);
  });

  it("handles empty plans array", () => {
    const result = mapStreamingPlans({
      title: { text: "Título", tag: "h2" },
      plans: []
    } as any);

    expect(result.plans).toEqual([]);
    expect(result.title).toEqual({ text: "Título", tag: "h2" });
  });

  it("handles missing plans array", () => {
    const result = mapStreamingPlans({
      title: { text: "Título", tag: "h2" }
    } as any);

    expect(result.plans).toEqual([]);
  });

  it("uses fallback alt text when image alternativeText is missing", () => {
    const result = mapStreamingPlans({
      plans: [
        {
          title: "Mi Plan",
          description: "Descripción",
          image: {
            url: "",
            alternativeText: null
          },
          ctas: []
        }
      ]
    } as any);

    expect(result.plans[0].image.alt).toBe("Mi Plan");
  });

  it("handles ctas without href", () => {
    const result = mapStreamingPlans({
      plans: [
        {
          title: "Plan",
          description: "Desc",
          image: { url: "" },
          ctas: [
            {
              label: "Click",
              href: null,
              type: "button",
              variant: "primary",
              hasIcon: false
            }
          ]
        }
      ]
    } as any);

    expect(result.plans[0].ctas[0]).toEqual({
      label: "Click",
      href: undefined,
      type: "button",
      color: "primary",
      icon: undefined,
      identifier: 2,
      leadFormSelection: undefined
    });
  });

  it("handles multiple plans with different configurations", () => {
    const result = mapStreamingPlans({
      title: { text: "Planes", tag: "h2" },
      plans: [
        {
          title: "Plan A",
          description: "Desc A",
          badgeText: "Popular",
          image: { url: "", alternativeText: "A" },
          ctas: [{ label: "Ver", href: "/a", hasIcon: false }]
        },
        {
          title: "Plan B",
          description: "Desc B",
          badgeText: "Oferta",
          image: { url: "", alternativeText: "B" },
          ctas: [
            { label: "Comprar", href: "/b", hasIcon: false },
            { label: "Info", href: "/b-info", hasIcon: true, icon: { name: "info" } }
          ]
        },
        {
          title: "Plan C",
          description: "Desc C",
          image: { url: "" },
          ctas: []
        }
      ]
    } as any);

    expect(result.plans).toHaveLength(3);
    expect(result.plans[0].badgeText).toBe("Popular");
    expect(result.plans[1].badgeText).toBe("Oferta");
    expect(result.plans[2].badgeText).toBeUndefined();
    expect(result.plans[1].ctas).toHaveLength(2);
    expect(result.plans[1].ctas[1].icon).toBe("info");
  });

  it("handles CTAs without label (returns empty label via mapButton)", () => {
    const result = mapStreamingPlans({
      plans: [
        {
          title: "Plan",
          description: "Desc",
          image: { url: "" },
          ctas: [
            {
              label: null,
              href: "/test",
              type: "button"
            },
            {
              label: "Valid CTA",
              href: "/valid",
              type: "button"
            }
          ]
        }
      ]
    } as any);

    expect(result.plans[0].ctas).toHaveLength(2);
    expect(result.plans[0].ctas[0]).toEqual({ label: "", identifier: 2 });
    expect(result.plans[0].ctas[1].label).toBe("Valid CTA");
  });

  it("preserves button defaults from mapButton (color defaults to primary)", () => {
    const result = mapStreamingPlans({
      plans: [
        {
          title: "Plan",
          description: "Desc",
          image: { url: "" },
          ctas: [
            {
              label: "CTA sin variant",
              href: "/test"
            }
          ]
        }
      ]
    } as any);
    expect(result.plans[0].ctas[0]).toEqual({
      label: "CTA sin variant",
      href: "/test",
      type: "link",
      color: "primary",
      icon: undefined,
      identifier: 2,
      target: undefined,
      leadFormSelection: undefined
    });
  });

  it("maps CTA identifiers for modal and whatsapp", () => {
    const result = mapStreamingPlans({
      plans: [
        {
          title: "Plan",
          description: "Desc",
          image: { url: "" },
          ctas: [
            { label: "Modal", identifier: "modal" },
            { label: "Whatsapp", identifier: "whatsapp" }
          ]
        }
      ]
    } as any);

    expect(result.plans[0].ctas[0].identifier).toBe(0);
    expect(result.plans[0].ctas[1].identifier).toBe(1);
  });

  it("falls back identifier to 2 when it is unknown", () => {
    const result = mapStreamingPlans({
      plans: [
        {
          title: "Plan",
          description: "Desc",
          image: { url: "" },
          ctas: [{ label: "Otro", identifier: "legacy" }]
        }
      ]
    } as any);

    expect(result.plans[0].ctas[0].identifier).toBe(2);
  });

  it("maps media url when image url is present", () => {
    const result = mapStreamingPlans({
      plans: [
        {
          title: "Plan",
          description: "Desc",
          image: { url: "/uploads/plan.png", alternativeText: "Plan" },
          ctas: []
        }
      ]
    } as any);

    expect(result.plans[0].image.src).toContain("/uploads/plan.png");
  });
});
