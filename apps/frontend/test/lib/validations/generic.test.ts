import {
  cedulaSchema,
  documentoSchema,
  telefonoSchema,
  emailSchema,
  numberSchema,
  textSchema,
  idCardSchema,
  schemaByType
} from "@lib/validations";

const buildCedula = (province: number, third: number, rest: number[]) => {
  const digits = [Math.floor(province / 10), province % 10, third, ...rest];
  const coef = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    let val = digits[i] * coef[i];
    if (val >= 10) val -= 9;
    sum += val;
  }

  const check = (10 - (sum % 10)) % 10;
  return `${digits.join("")}${check}`;
};

describe("validation schemas", () => {
  it("validates a correct cedula", async () => {
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);
    await expect(cedulaSchema.isValid(cedula)).resolves.toBe(true);
  });

  it("rejects an invalid cedula", async () => {
    await expect(cedulaSchema.isValid("123")).resolves.toBe(false);
  });

  it("validates document as cedula or RUC", async () => {
    const cedula = buildCedula(17, 2, [1, 2, 3, 4, 5, 6]);
    const ruc = `${cedula}001`;
    await expect(documentoSchema.isValid(cedula)).resolves.toBe(true);
    await expect(documentoSchema.isValid(ruc)).resolves.toBe(true);
  });

  it("validates phone with correct format", async () => {
    await expect(telefonoSchema.isValid("0999999999")).resolves.toBe(true);
  });

  it("rejects phone without 10 digits or without leading 0", async () => {
    await expect(telefonoSchema.isValid("999")).resolves.toBe(false);
    await expect(telefonoSchema.isValid("1999999999")).resolves.toBe(false);
  });

  it("returns expected error messages for cedula and phone", async () => {
    await expect(cedulaSchema.validate("123")).rejects.toThrow(
      "Cédula inválida. Debe ser una cédula ecuatoriana válida de 10 dígitos"
    );
    await expect(telefonoSchema.validate("099")).rejects.toThrow(
      "El teléfono debe tener 10 dígitos"
    );
  });

  it("returns expected error message for document", async () => {
    await expect(documentoSchema.validate("12345678901")).rejects.toThrow(
      "Debe ingresar una cédula válida (10 dígitos) o RUC válido (13 dígitos)"
    );
  });

  it("rejects empty values in schemas", async () => {
    await expect(cedulaSchema.isValid(undefined as any)).resolves.toBe(false);
    await expect(documentoSchema.isValid(undefined as any)).resolves.toBe(
      false
    );
    await expect(telefonoSchema.isValid(undefined as any)).resolves.toBe(false);
  });

  it("rejects document with invalid length", async () => {
    await expect(documentoSchema.isValid("12345678901")).resolves.toBe(false);
  });

  it("accepts phone with 10 digits starting with 0", async () => {
    await expect(telefonoSchema.isValid("0123456789")).resolves.toBe(true);
  });

  it("validates email, number and text schemas", async () => {
    await expect(emailSchema.isValid("alexis@test.com")).resolves.toBe(true);
    await expect(emailSchema.isValid("bad-email")).resolves.toBe(false);

    await expect(numberSchema.isValid("12345")).resolves.toBe(true);
    await expect(numberSchema.isValid("12ab")).resolves.toBe(false);

    await expect(textSchema.isValid("hola")).resolves.toBe(true);
    await expect(textSchema.isValid("")).resolves.toBe(false);
  });

  it("validates idCard schema for cedula/ruc and rejects invalid", async () => {
    const cedula = buildCedula(17, 2, [1, 2, 3, 4, 5, 6]);
    const ruc = `${cedula}001`;

    await expect(idCardSchema.isValid(cedula)).resolves.toBe(true);
    await expect(idCardSchema.isValid(ruc)).resolves.toBe(true);
    await expect(idCardSchema.isValid("123")).resolves.toBe(false);
  });

  it("exposes expected keys in schemaByType", () => {
    expect(Object.keys(schemaByType).sort()).toEqual([
      "email",
      "fingerprintCode",
      "idCard",
      "number",
      "tel",
      "text"
    ]);
  });
});
