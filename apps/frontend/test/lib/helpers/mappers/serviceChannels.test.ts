import { mapServiceChannels } from "@lib/helpers/mappers/serviceChannels";

describe("mapServiceChannels", () => {
  it("maps channels and shortcuts widget", () => {
    const result = mapServiceChannels({
      id: 5,
      title: { text: "Canales", tag: "h2" },
      attentionCard: [
        {
          id: 1,
          title: "Soporte",
          text: "24/7",
          icon: { name: "phone" },
          button: { label: "Llamar", href: "/call", variant: "primary", type: "link" }
        }
      ],
      shortcuts: {
        id: 9,
        items: [
          {
            id: 3,
            label: "Pago",
            href: "/pay",
            isExternal: true,
            icon: { id: 1, name: "card", type: "solid", size: "sm" }
          }
        ]
      }
    } as any);

    expect(result).toEqual({
      id: 5,
      title: { text: "Canales", tag: "h2" },
      channels: [
        {
          id: 1,
          title: "Soporte",
          text: "24/7",
          icon: "phone",
          button: {
            label: "Llamar",
            href: "/call",
            variant: "primary",
            type: "link"
          }
        }
      ],
      widget: {
        id: 9,
        name: "shortcuts",
        widget: [
          {
            __component: "block.shortcuts",
            items: [
              {
                id: 3,
                label: "Pago",
                href: "/pay",
                isExternal: true,
                icon: {
                  id: 1,
                  name: "card",
                  type: "solid",
                  size: "sm"
                }
              }
            ]
          }
        ]
      }
    });
  });

  it("returns empty widget when shortcuts are missing", () => {
    const result = mapServiceChannels({
      attentionCard: [
        {
          id: 2,
          name: "Chat",
          description: "Escribenos",
          icon: null,
          button: null
        }
      ]
    } as any);

    expect(result.widget).toBeUndefined();
    expect(result.channels).toEqual([
      {
        id: 2,
        title: "Chat",
        text: "Escribenos",
        icon: undefined,
        button: null
      }
    ]);
  });

  it("returns widget when shortcuts list is empty but present", () => {
    const result = mapServiceChannels({
      shortcuts: { id: 1, items: [] }
    } as any);

    expect(result.widget).toEqual({
      id: 1,
      name: "shortcuts",
      widget: [
        {
          __component: "block.shortcuts",
          items: []
        }
      ]
    });
  });

  it("maps fallback fields when title/text are missing and button has minimal data", () => {
    const result = mapServiceChannels({
      attentionCard: [
        {
          id: 5,
          name: "Fallback name",
          description: "Fallback description",
          icon: {},
          button: { label: "Ir" }
        }
      ]
    } as any);

    expect(result.channels![0]).toEqual({
      id: 5,
      title: "Fallback name",
      text: "Fallback description",
      icon: undefined,
      button: {
        label: "Ir",
        href: undefined,
        variant: "primary",
        type: undefined
      }
    });
  });

  it("returns completely empty maps when data misses all critical fields", () => {
    const result = mapServiceChannels({} as any);
    expect(result.channels).toEqual([]);
    expect(result.title).toBeUndefined();
    expect(result.id).toBeUndefined();
  });
});
