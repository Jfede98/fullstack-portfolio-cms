import { mapWidget } from "@lib/helpers/mappers/widget";

describe("mapWidget", () => {
  it("maps widgets relation payload", () => {
    const input: Parameters<typeof mapWidget>[0] = {
      widgets: [
        { widget: [{ __component: "block.features", id: 1 }] },
        { widget: [{ __component: "block.cta-banner", id: 2 }] }
      ]
    };

    expect(
      mapWidget(input)
    ).toEqual({
      widget: [
        { __component: "block.features", id: 1 },
        { __component: "block.cta-banner", id: 2 }
      ]
    });
  });

  it("returns empty widget array when no widget blocks are available", () => {
    const input: Parameters<typeof mapWidget>[0] = { widgets: [] };
    expect(mapWidget(input)).toEqual({ widget: [] });
  });

  it("returns empty widget array when widgets is undefined or contains null items", () => {
    expect(mapWidget({} as any)).toEqual({ widget: [] });
    expect(
      mapWidget({
        widgets: [null, { widget: null }]
      } as any)
    ).toEqual({ widget: [] });
  });
});
