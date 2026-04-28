import { mapComparativeTable } from "@lib/helpers/mappers/comparativeTable";

describe("mapComparativeTable", () => {
  it("maps complete comparative table data", () => {
    const result = mapComparativeTable({
      id: 1,
      title: { text: "Compara nuestros planes", tag: "h2" },
      subtitle: { text: "Elige el mejor para ti", tag: "h3" },
      comparative: [
        { id: 1, label: "Instalación", description: "Instalación gratuita" },
        { id: 2, label: "Soporte 24/7", description: "Atención permanente" }
      ],
      sections: [
        {
          id: 1,
          label: "Plan 400 mb",
          price: "25.99",
          prevPrice: "30.00",
          buttons: [
            {
              label: "Contratar",
              href: "/contratar",
              type: "button",
              variant: "primary",
              hasIcon: false,
              identifier: "whatsapp"
            }
          ],
          activeStatus: [
            { id: 1, isActive: true },
            { id: 2, isActive: false }
          ]
        }
      ]
    } as any);

    expect(result).toEqual({
      title: { text: "Compara nuestros planes", tag: "h2" },
      subtitle: { text: "Elige el mejor para ti", tag: "h3" },
      comparative: [
        { label: "Instalación", description: "Instalación gratuita" },
        { label: "Soporte 24/7", description: "Atención permanente" }
      ],
      sections: [
        {
          label: "Plan 400 mb",
          plan: {
            price: 25.99,
            prevPrice: 30,
            buttons: [
              {
                children: "Contratar",
                href: "/contratar",
                type: "button",
                color: "primary",
                icon: undefined,
                identifier: 1
              }
            ]
          },
          active: [true, false]
        }
      ]
    });
  });

  it("handles missing title and subtitle", () => {
    const result = mapComparativeTable({
      comparative: [{ label: "Feature 1", description: "Desc 1" }],
      sections: []
    } as any);

    expect(result.title).toBeUndefined();
    expect(result.subtitle).toBeUndefined();
    expect(result.comparative).toEqual([
      { label: "Feature 1", description: "Desc 1" }
    ]);
    expect(result.sections).toBeUndefined();
  });

  it("filters out comparative parameters without label or description", () => {
    const result = mapComparativeTable({
      comparative: [
        { id: 1, label: "Valid", description: "Valid desc" },
        { id: 2, label: "", description: "" },
        { id: 3, label: null, description: null }
      ]
    } as any);

    expect(result.comparative).toEqual([
      { label: "Valid", description: "Valid desc" }
    ]);
  });

  it("filters out sections without label", () => {
    const result = mapComparativeTable({
      sections: [
        {
          id: 1,
          label: "Plan A",
          price: "10",
          prevPrice: "15",
          buttons: [],
          activeStatus: []
        },
        {
          id: 2,
          label: "",
          price: "20",
          prevPrice: "25",
          buttons: [],
          activeStatus: []
        },
        {
          id: 3,
          label: null,
          price: "30",
          prevPrice: "35",
          buttons: [],
          activeStatus: []
        }
      ]
    } as any);

    expect(result.sections).toEqual([
      {
        label: "Plan A",
        plan: {
          price: 10,
          prevPrice: 15,
          buttons: undefined
        },
        active: []
      }
    ]);
  });

  it("converts price strings to numbers", () => {
    const result = mapComparativeTable({
      sections: [
        {
          label: "Plan B",
          price: "19.99",
          prevPrice: "24.50",
          buttons: [],
          activeStatus: []
        }
      ]
    } as any);

    expect(result.sections?.[0].plan.price).toBe(19.99);
    expect(result.sections?.[0].plan.prevPrice).toBe(24.5);
  });

  it("handles missing prices", () => {
    const result = mapComparativeTable({
      sections: [
        {
          label: "Plan C",
          price: null,
          prevPrice: undefined,
          buttons: [],
          activeStatus: []
        }
      ]
    } as any);

    expect(result.sections?.[0].plan.price).toBeUndefined();
    expect(result.sections?.[0].plan.prevPrice).toBeUndefined();
  });

  it("maps buttons correctly", () => {
    const result = mapComparativeTable({
      sections: [
        {
          label: "Plan D",
          price: "15",
          prevPrice: "20",
          buttons: [
            {
              label: "Button 1",
              href: "/link1",
              type: "link",
              variant: "secondary",
              hasIcon: true,
              icon: { name: "check" },
              identifier: "whatsapp"
            },
            {
              label: "Button 2",
              href: null,
              type: "button",
              variant: "primary",
              hasIcon: false,
              identifier: 2
            }
          ],
          activeStatus: []
        }
      ]
    } as any);

    expect(result.sections?.[0].plan.buttons).toEqual([
      {
        children: "Button 1",
        href: "/link1",
        type: "link",
        color: "secondary",
        icon: "check",
        identifier: 1
      },
      {
        children: "Button 2",
        href: undefined,
        type: "button",
        color: "primary",
        icon: undefined,
        identifier: 0
      }
    ]);
  });

  it("handles empty buttons array", () => {
    const result = mapComparativeTable({
      sections: [
        {
          label: "Plan E",
          price: "10",
          prevPrice: "12",
          buttons: [],
          activeStatus: []
        }
      ]
    } as any);

    expect(result.sections?.[0].plan.buttons).toBeUndefined();
  });

  it("converts activeStatus array to boolean array", () => {
    const result = mapComparativeTable({
      sections: [
        {
          label: "Plan F",
          price: "20",
          prevPrice: "25",
          buttons: [],
          activeStatus: [
            { id: 1, isActive: true },
            { id: 2, isActive: false },
            { id: 3, isActive: true },
            { id: 4, isActive: null },
            { id: 5, isActive: undefined }
          ]
        }
      ]
    } as any);

    expect(result.sections?.[0].active).toEqual([true, false, true, false, false]);
  });

  it("handles missing activeStatus", () => {
    const result = mapComparativeTable({
      sections: [
        {
          label: "Plan G",
          price: "30",
          prevPrice: "35",
          buttons: [],
          activeStatus: null
        }
      ]
    } as any);

    expect(result.sections?.[0].active).toEqual([]);
  });

  it("returns undefined for empty comparative array", () => {
    const result = mapComparativeTable({
      comparative: []
    } as any);

    expect(result.comparative).toBeUndefined();
  });

  it("returns undefined for empty sections array", () => {
    const result = mapComparativeTable({
      sections: []
    } as any);

    expect(result.sections).toBeUndefined();
  });

  it("maps titleTable when provided", () => {
    const result = mapComparativeTable({
      titleTable: { text: "Características", tag: "h2" },
      comparative: [],
      sections: []
    } as any);

    expect(result.titleTable).toEqual({ text: "Características", tag: "h2" });
  });

  it("returns undefined titleTable when not provided", () => {
    const result = mapComparativeTable({
      comparative: [],
      sections: []
    } as any);

    expect(result.titleTable).toBeUndefined();
  });

  it("maps titleTable using mapTypography (text only, no tag)", () => {
    const result = mapComparativeTable({
      titleTable: { text: "Solo texto" },
      comparative: [],
      sections: []
    } as any);

    expect(result.titleTable).toEqual({ text: "Solo texto", tag: undefined });
  });

  it("handles complex scenario with multiple sections", () => {
    const result = mapComparativeTable({
      title: { text: "Tabla Comparativa", tag: "h2" },
      subtitle: { text: "Subtítulo", tag: "p" },
      comparative: [
        { label: "Feature 1", description: "Desc 1" },
        { label: "Feature 2", description: "Desc 2" },
        { label: "Feature 3", description: "Desc 3" }
      ],
      sections: [
        {
          label: "Básico",
          price: "10.00",
          prevPrice: "15.00",
          buttons: [
            {
              label: "Comprar",
              type: "button",
              variant: "primary",
              hasIcon: false,
              identifier: 1
            }
          ],
          activeStatus: [
            { isActive: true },
            { isActive: false },
            { isActive: false }
          ]
        },
        {
          label: "Premium",
          price: "25.00",
          prevPrice: "30.00",
          buttons: [
            {
              label: "Comprar Premium",
              type: "button",
              variant: "secondary",
              hasIcon: false,
              identifier: 2
            }
          ],
          activeStatus: [
            { isActive: true },
            { isActive: true },
            { isActive: true }
          ]
        }
      ]
    } as any);

    expect(result.title).toEqual({ text: "Tabla Comparativa", tag: "h2" });
    expect(result.subtitle).toEqual({ text: "Subtítulo", tag: "p" });
    expect(result.comparative).toHaveLength(3);
    expect(result.sections).toHaveLength(2);
    expect(result.sections?.[0].active).toEqual([true, false, false]);
    expect(result.sections?.[1].active).toEqual([true, true, true]);
  });
});
