import {
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

describe("index validation schemas", () => {
  it("validates email schema success and failure", async () => {
    await expect(emailSchema.isValid("test@mail.com")).resolves.toBe(true);
    await expect(emailSchema.isValid("not-an-email")).resolves.toBe(false);
    await expect(emailSchema.isValid(undefined as any)).resolves.toBe(false);
  });

  it("validates number schema success and failure", async () => {
    await expect(numberSchema.isValid("12345")).resolves.toBe(true);
    await expect(numberSchema.isValid("12ab")).resolves.toBe(false);
    await expect(numberSchema.isValid(undefined as any)).resolves.toBe(false);
  });

  it("validates text schema success and failure", async () => {
    await expect(textSchema.isValid("hola")).resolves.toBe(true);
    await expect(textSchema.isValid("")).resolves.toBe(false);
  });

  it("validates idCard schema with cedula and ruc", async () => {
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);
    const ruc = `${cedula}001`;

    await expect(idCardSchema.isValid(cedula)).resolves.toBe(true);
    await expect(idCardSchema.isValid(ruc)).resolves.toBe(true);
    await expect(idCardSchema.isValid("123")).resolves.toBe(false);
    await expect(idCardSchema.isValid(undefined as any)).resolves.toBe(false);
  });

  it("exposes expected schemaByType keys", () => {
    expect(Object.keys(schemaByType).sort()).toEqual(
      ["email", "fingerprintCode", "idCard", "number", "tel", "text"].sort()
    );
  });
});
