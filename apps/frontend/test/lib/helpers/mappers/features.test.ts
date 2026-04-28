import { mapFeatures } from "@lib/helpers/mappers/features";
import type { StrapiBlockWithItems } from "@interfaces/lib/strapi/strapi";

describe("mapFeatures", () => {
  it("maps block with items extracting values from button", () => {
    const result = mapFeatures({
      id: 10,
      title: { text: "Beneficios", tag: "h2" },
      mainItems: [
        {
          id: 1,
          description: "Desc",
          button: { label: "Item 1", icon: { name: "wifi" }, href: "/hogar", isExternalHref: false, identifier: "simple" }
        },
        {
          id: 2,
          description: "",
          button: { label: "Item 2", identifier: "simple" }
        },
        {
          id: 3,
          description: "x",
          button: { label: "Item 3", icon: {}, href: "https://ext.com", isExternalHref: true, identifier: "simple" }
        }
      ]
    } as StrapiBlockWithItems);

    expect(result).toEqual({
      id: 10,
      title: { text: "Beneficios", tag: "h2" },
      layout: "horizontal",
      items: [
        { id: 1, title: "Item 1", description: "Desc", icon: "wifi", href: "/hogar", isExternal: false, color: "primary", identifier: 2, leadFormSelection: undefined },
        { id: 2, title: "Item 2", description: "", icon: "", href: undefined, isExternal: false, color: "primary", identifier: 2, leadFormSelection: undefined },
        { id: 3, title: "Item 3", description: "x", icon: "", href: "https://ext.com", isExternal: true, color: "primary", identifier: 2, leadFormSelection: undefined }
      ]
    });
  });

  it("falls back to item.name / item.title when button is absent", () => {
    const result = mapFeatures({
      id: 11,
      mainItems: [
        { id: 1, name: "Fallback Name", description: "d1", icon: { name: "star" } },
        { id: 2, title: "Fallback Title", description: "d2" }
      ]
    } as StrapiBlockWithItems);

    expect(result.items).toEqual([
      { id: 1, title: "", description: "d1", icon: "", href: undefined, isExternal: false, color: undefined, identifier: undefined, leadFormSelection: undefined },
      { id: 2, title: "", description: "d2", icon: "", href: undefined, isExternal: false, color: undefined, identifier: undefined, leadFormSelection: undefined }
    ]);
  });

  it("handles missing mainItems and title", () => {
    const result = mapFeatures({ id: 20 } as StrapiBlockWithItems);
    expect(result).toEqual({
      id: 20,
      title: undefined,
      layout: "horizontal",
      items: []
    });
  });

  it("maps vertical layout variant", () => {
    const result = mapFeatures({
      id: 30,
      layoutVariant: "vertical"
    } as StrapiBlockWithItems);

    expect(result.layout).toBe("vertical");
  });

  it("maps color from button variant instead of item.color", () => {
    const result = mapFeatures({
      id: 40,
      mainItems: [
        { id: 1, name: "Item con variant", description: "desc", button: { label: "Btn", identifier: "simple", variant: "secondary" } },
        { id: 2, name: "Item sin button", description: "desc" }
      ]
    } as StrapiBlockWithItems);

    expect(result.items?.[0].color).toBe("secondary");
    expect(result.items?.[1].color).toBeUndefined();
  });

  it("maps identifier and leadFormSelection for modal button", () => {
    const result = mapFeatures({
      id: 50,
      mainItems: [
        {
          id: 1,
          description: "Modal item",
          button: {
            label: "Abrir modal",
            identifier: "modal",
            lead_form: {
              documentId: "abc123",
              name: "FinalForm",
              channel: "web",
              variant: "default",
              isActive: true,
              automaticFlow: false,
              lead_routing_configs: [{ documentId: "cfg1", isActive: true, distributionMode: "round-robin" }]
            }
          }
        }
      ]
    } as StrapiBlockWithItems);

    expect(result.items?.[0].identifier).toBe(0);
    expect(result.items?.[0].leadFormSelection?.leadFormDocumentId).toBe("abc123");
  });
});
