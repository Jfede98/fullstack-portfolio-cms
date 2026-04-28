import { mapButton } from "@lib/helpers/mappers/button";

describe("mapButton", () => {
  it("returns undefined when label is missing", () => {
    expect(mapButton(null)).toBeUndefined();
    expect(mapButton({} as any)).toBeUndefined();
  });

  it("maps button fields", () => {
    expect(
      mapButton({
        label: "Comprar",
        href: "/buy",
        type: "link",
        variant: "secondary",
        hasIcon: true,
        icon: { name: "arrow" }
      } as any)
    ).toEqual({
      children: "Comprar",
      href: "/buy",
      type: "link",
      color: "secondary",
      target: undefined,
      icon: "arrow",
      leadFormSelection: undefined
    });
  });

  it("defaults icon to undefined when hasIcon is false", () => {
    expect(
      mapButton({
        label: "Ver",
        hasIcon: false
      } as any)
    ).toEqual({
      children: "Ver",
      href: undefined,
      type: undefined,
      color: "primary",
      target: undefined,
      icon: undefined,
      leadFormSelection: undefined
    });
  });

  it("maps external href to link target blank", () => {
    expect(
      mapButton({
        label: "WhatsApp",
        href: "https://wa.me/593000000000",
        isExternalHref: true
      } as any)
    ).toEqual({
      children: "WhatsApp",
      href: "https://wa.me/593000000000",
      type: "link",
      color: "primary",
      target: "_blank",
      icon: undefined,
      leadFormSelection: undefined
    });
  });

  it("forces link type when href exists and type is missing", () => {
    expect(
      mapButton({
        label: "Ir",
        href: "/ruta"
      } as any)
    ).toEqual({
      children: "Ir",
      href: "/ruta",
      type: "link",
      color: "primary",
      target: undefined,
      icon: undefined,
      leadFormSelection: undefined
    });
  });

  it("maps semiautomatic-flow identifier to 3", () => {
    const result = mapButton({
      label: "Contratar",
      identifier: "semiautomatic-flow"
    } as any);

    expect(result?.identifier).toBe(3);
  });

  it("maps modal identifier to 0", () => {
    expect(mapButton({ label: "Abrir", identifier: "modal" } as any)?.identifier).toBe(0);
  });

  it("maps whatsapp identifier to 1", () => {
    expect(mapButton({ label: "WA", identifier: "whatsapp" } as any)?.identifier).toBe(1);
  });

  it("maps simple identifier to 2", () => {
    expect(mapButton({ label: "Enviar", identifier: "simple" } as any)?.identifier).toBe(2);
  });

  it("maps lead identifier to 4", () => {
    expect(mapButton({ label: "Enviar lead", identifier: "lead" } as any)?.identifier).toBe(4);
  });

  it("maps coverage identifier to 5", () => {
    expect(mapButton({ label: "Cobertura", identifier: "coverage" } as any)?.identifier).toBe(5);
  });
});
