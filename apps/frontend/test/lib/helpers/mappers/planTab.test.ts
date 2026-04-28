import { mapPlanTab } from "@lib/helpers/mappers/planTab";

describe("mapPlanTab", () => {
  it("maps categories, plans, and grid rules", () => {
    const result = mapPlanTab({
      title: { text: "Planes", tag: "h2" },
      description: "Desc",
      categories: [
        {
          id: 1,
          label: "Hogar",
          icon: { name: "home", type: "solid", size: "md" },
          title: { text: "Plan hogar", tag: "h3" },
          description: "Desc",
          plans: [
            {
              name: "Plan 1",
              speedValue: "100",
              speedUnit: "Mbps",
              isRecommended: true,
              priceInfo: { amount: "10" },
              ctaButtons: [{ label: "Comprar", variant: "link" }],
              benefits: [{ name: "Soporte" }],
              apps: []
            },
            {
              name: null
            }
          ]
        }
      ],
      gridRules: [{ id: 1, breakpoint: "md", itemsPerRow: 3 }]
    } as any);

    expect(result).toEqual({
      title: { text: "Planes", tag: "h2" },
      description: "Desc",
      categories: [
        {
          id: 1,
          label: "Hogar",
          icon: { name: "home", type: "solid", size: "md" },
          title: { text: "Plan hogar", tag: "h3" },
          description: "Desc",
          plans: [
            {
              name: "Plan 1",
              id: undefined,
              speedValue: "100",
              speedUnit: "Mbps",
              isRecommended: true,
              isRecommendedText: undefined,
              priceInfo: {
                amount: "10",
                taxLabel: "",
                originalPrice: "",
                legalDisclaimer: "",
                promoLabel: ""
              },
              ctaButtons: [
                {
                  label: "Comprar",
                  href: undefined,
                  type: "primary",
                  icon: undefined,
                  identifier: 0,
                  leadFormSelection: undefined,
                  target: "_self"
                }
              ],
              benefits: [
                {
                  name: "Soporte",
                  description: undefined,
                  url: undefined,
                  icon: undefined
                }
              ],
              apps: [],
              detailsContent: undefined
            }
          ]
        }
      ],
      gridRules: [{ id: 1, breakpoint: "md", itemsPerRow: 3 }]
    });
  });

  it("filters invalid categories and grid rules", () => {
    const result = mapPlanTab({
      categories: [null, undefined],
      gridRules: [null]
    } as any);

    expect(result.categories).toEqual([]);
    expect(result.gridRules).toEqual([]);
  });

  it("supports feature icon as array and single object", () => {
    const result = mapPlanTab({
      categories: [
        {
          plans: [
            {
              name: "Plan 2",
              speedValue: "200",
              speedUnit: "Mbps",
              benefits: [
                { name: "Soporte", icon: [{ name: "headset" }] },
                { description: "Promo", icon: { name: "gift" } }
              ]
            }
          ]
        }
      ]
    } as any);

    expect((result as any).categories[0].plans[0].benefits).toEqual([
      {
        name: "Soporte",
        description: undefined,
        url: undefined,
        icon: "headset"
      },
      {
        name: undefined,
        description: "Promo",
        url: undefined,
        icon: "gift"
      }
    ]);
  });

  it("maps category label from label/text/title objects", () => {
    const result = mapPlanTab({
      categories: [
        { label: { label: "Label A" }, plans: [] },
        { label: { text: "Label B" }, plans: [] },
        { label: { title: "Label C" }, plans: [] }
      ]
    } as any);

    expect(result.categories!.map((item) => item.label)).toEqual([
      "Label A",
      "Label B",
      "Label C"
    ]);
  });

  it("filters empty features and invalid plans", () => {
    const result = mapPlanTab({
      categories: [
        {
          plans: [
            {
              name: "Plan válido",
              speedValue: "100",
              speedUnit: "Mbps",
              benefits: [{}],
              apps: [null, { name: "App" }]
            },
            {
              name: null
            }
          ]
        }
      ]
    } as any);

    expect(result.categories![0].plans).toHaveLength(1);
    expect(result.categories![0]!.plans![0]!.benefits).toEqual([]);
    expect(result.categories![0]!.plans![0]!.apps).toEqual([
      {
        name: "App",
        description: undefined,
        url: undefined,
        imageAlt: undefined,
        useCustomIcon: false,
        customIcon: undefined,
        icon: undefined
      }
    ]);
  });

  it("maps app custom_icon fields and disables custom icon when inactive", () => {
    const result = mapPlanTab({
      categories: [
        {
          plans: [
            {
              name: "Plan apps",
              speedValue: "200",
              speedUnit: "Mbps",
              apps: [
                {
                  name: "Liga Ecuabet",
                  useCustomIcon: true,
                  custom_icon: {
                    isActive: true,
                    image: {
                      url: "https://cdn.test/liga.png",
                      alternativeText: "Logo Liga Ecuabet"
                    }
                  }
                },
                {
                  name: "Disney+",
                  useCustomIcon: true,
                  custom_icon: {
                    isActive: false,
                    image: {
                      url: "https://cdn.test/disney.png",
                      alternativeText: "Logo Disney+"
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    } as any);

    expect(result.categories![0]!.plans![0]!.apps).toEqual([
      {
        name: "Liga Ecuabet",
        description: undefined,
        url: "https://cdn.test/liga.png",
        imageAlt: "Logo Liga Ecuabet",
        useCustomIcon: true,
        customIcon: undefined,
        icon: undefined

      },
      {
        name: "Disney+",
        description: undefined,
        url: undefined,
        imageAlt: undefined,
        useCustomIcon: false,
        customIcon: undefined,
        icon: undefined
      }
    ]);
  });
});
