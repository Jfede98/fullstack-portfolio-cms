import { mapperForm } from "@lib/helpers/mappers/form";

describe("mapperForm", () => {
  it("maps form fields and inputs", () => {
    const result = mapperForm({
      title: "Contacto",
      description: "Desc",
      icon: { name: "info" },
      privacyCheckbox: {
        label: "Acepto terminos",
        name: "privacy_policy",
        required: true
      },
      statusMessage: [
        {
          title: "Ok",
          description: "Todo bien",
          buttonLabel: "Cerrar",
          type: "success"
        }
      ],
      inputs: [
        {
          label: "Nombre",
          placeholder: "Ingresa",
          name: "name",
          type: "text"
        }
      ],
      button: { label: "Enviar", variant: "primary" }
    } as any);

    expect(result.title).toBe("Contacto");
    expect(result.icon).toEqual({ name: "info", type: undefined, size: undefined });
    expect(result.inputs).toEqual([
      {
        name: "name",
        label: "Nombre",
        placeholder: "Ingresa",
        type: "text",
        maxLength: undefined,
        icon: undefined,
        searchable: undefined,
        optionsSource: undefined,
        optionsApi: undefined,
        required: false,
        column: "default",
        options: undefined
      }
    ]);
    expect(result.button).toEqual({
      children: "Enviar",
      href: undefined,
      isExternalHref: false,
      type: undefined,
      color: "primary",
      hasIcon: false
    });
    expect(result.privacyCheckbox).toEqual({
      label: "Acepto terminos",
      name: "privacy_policy",
      required: true
    });
    expect(result.statusMessage).toEqual([
      {
        title: "Ok",
        description: "Todo bien",
        buttonLabel: "Cerrar",
        type: "success"
      }
    ]);
    expect(result.isBlock).toBe(true);
  });

  it("maps external form button as link with target blank", () => {
    const result = mapperForm({
      title: "Contacto",
      description: "Desc",
      inputs: [],
      button: {
        label: "Ir",
        href: "https://example.com",
        isExternalHref: true
      }
    } as any);

    expect(result.button).toEqual({
      children: "Ir",
      href: "https://example.com",
      type: "link",
      target: "_blank",
      color: "primary",
      hasIcon: false
    });
  });

  it("defaults privacy checkbox required to true when required is missing", () => {
    const result = mapperForm({
      privacyCheckbox: {
        label: "Acepto terminos",
        name: "privacy_policy"
      },
      inputs: [],
      button: { label: "Enviar" }
    } as any);

    expect(result.privacyCheckbox?.required).toBe(true);
  });

  it("maps semiautomatic-flow button identifier to 3", () => {
    const result = mapperForm({
      button: { label: "Siguiente paso", identifier: "semiautomatic-flow" }
    } as any);

    expect(result.button?.identifier).toBe(3);
  });

  it("maps modal button identifier to 0", () => {
    const result = mapperForm({
      button: { label: "Abrir formulario", identifier: "modal" }
    } as any);

    expect(result.button?.identifier).toBe(0);
  });

  it("maps simple button identifier to 2", () => {
    const result = mapperForm({
      button: { label: "Enviar", identifier: "simple" }
    } as any);

    expect(result.button?.identifier).toBe(2);
  });

  it("maps coverage button identifier to 5", () => {
    const result = mapperForm({
      button: { label: "Consultar cobertura", identifier: "coverage" }
    } as any);

    expect(result.button?.identifier).toBe(5);
  });
});
