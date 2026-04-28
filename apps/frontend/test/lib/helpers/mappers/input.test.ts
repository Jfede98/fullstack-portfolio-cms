import { mapInput } from "@lib/helpers/mappers/input";

describe("mapInput", () => {
  it("returns undefined when data is missing", () => {
    expect(mapInput(null)).toBeUndefined();
  });

  it("maps base input fields", () => {
    expect(
      mapInput({
        label: "Nombre",
        placeholder: "Ingresa tu nombre",
        name: "name",
        type: "text",
        maxLength: 50
      } as any)
    ).toEqual({
      label: "Nombre",
      placeholder: "Ingresa tu nombre",
      type: "text",
      maxLength: 50,
      icon: undefined,
      searchable: undefined,
      optionsSource: undefined,
      optionsApi: undefined,
      required: false,
      column: "default",
      options: undefined
    });
  });

  it("maps idCard input as base input", () => {
    expect(
      mapInput({
        label: "Cédula",
        placeholder: "Ingresa tu cédula",
        name: "document",
        type: "idCard",
        maxLength: 13,
        required: true
      } as any)
    ).toEqual({
      label: "Cédula",
      placeholder: "Ingresa tu cédula",
      type: "idCard",
      maxLength: 13,
      icon: undefined,
      searchable: undefined,
      optionsSource: undefined,
      optionsApi: undefined,
      required: true,
      column: "default",
      options: undefined
    });
  });

  it("maps combobox input with static options when type is combobox", () => {
    const result = mapInput({
      label: "Provincia",
      placeholder: "Selecciona",
      name: "province",
      type: "combobox",
      searchable: true,
      required: true,
      options: [
        { label: "Pichincha", value: "pichincha" },
        { label: "Guayas", value: "guayas", disabled: false }
      ]
    } as any);

    expect(result).toEqual({
      icon: undefined,
      label: "Provincia",
      placeholder: "Selecciona",
      type: "combobox",
      maxLength: undefined,
      searchable: true,
      optionsSource: "static",
      optionsApi: undefined,
      required: true,
      column: "default",
      options: [
        { label: "Pichincha", value: "pichincha", disabled: false },
        { label: "Guayas", value: "guayas", disabled: false }
      ]
    });
  });

  it("maps combobox with no options returns empty array", () => {
    const result = mapInput({
      label: "Ciudad",
      placeholder: "Selecciona",
      name: "city",
      type: "combobox"
    } as any);

    expect(result).toEqual({
      icon: undefined,
      label: "Ciudad",
      placeholder: "Selecciona",
      type: "combobox",
      maxLength: undefined,
      searchable: false,
      optionsSource: "static",
      optionsApi: undefined,
      required: false,
      column: "default",
      options: []
    });
  });
});
