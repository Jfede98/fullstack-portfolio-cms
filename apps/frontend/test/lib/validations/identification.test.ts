import { validarCedula, validarCedulaORUC, validarRuc } from "@lib/validations/identification";

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

describe("identification validations", () => {
  it("validates cedula and ruc", () => {
    const cedula = buildCedula(1, 2, [3, 4, 5, 6, 7, 8]);
    expect(validarCedula(cedula)).toBe(true);
    expect(validarCedula("0000000000")).toBe(false);

    const ruc = `${cedula}001`;
    expect(validarRuc(ruc)).toBe(true);
    expect(validarRuc("123")).toBe(false);
  });

  it("validates cedula or ruc and returns proper type", () => {
    const cedula = buildCedula(2, 4, [3, 4, 5, 6, 7, 8]);
    const resCedula = validarCedulaORUC(cedula);
    expect(resCedula.tipo).toBe("cedula");
    expect(resCedula.valido).toBe(true);

    const ruc = `${cedula}001`;
    const resRuc = validarCedulaORUC(ruc);
    expect(resRuc.tipo).toBe("ruc");
    expect(resRuc.valido).toBe(true);

    const invalid = validarCedulaORUC("123");
    expect(invalid.tipo).toBe("invalido");
  });

  it("validates ruc for private and public entities", () => {
    // third digit 9 (private)
    const base = "099000001"; // province 09, third digit 9
    const coef = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(base[i], 10) * coef[i];
    }
    const res = sum % 11;
    const check = res === 0 ? 0 : 11 - res;
    const rucPrivate = `${base}${check}001`;
    expect(validarRuc(rucPrivate)).toBe(true);

    // third digit 6 (public)
    const basePublic = "11600000"; // province 11, third digit 6, 8 digits for public calc
    const coefPublic = [3, 2, 7, 6, 5, 4, 3, 2];
    let sumPublic = 0;
    for (let i = 0; i < 8; i++) {
      sumPublic += parseInt(basePublic[i], 10) * coefPublic[i];
    }
    const resPublic = sumPublic % 11;
    const checkPublic = resPublic === 0 ? 0 : 11 - resPublic;
    const rucPublic = `${basePublic}${checkPublic}0001`;
    expect(validarRuc(rucPublic)).toBe(true);
  });

  it("returns false for invalid province or third digit", () => {
    expect(validarCedula("0000000000")).toBe(false);
    expect(validarCedula("2599999999")).toBe(false);
  });

  it("rejects invalid ruc for natural person and bad check digits", () => {
    const cedula = buildCedula(1, 2, [3, 4, 5, 6, 7, 8]);
    const rucNatural = `${cedula}002`;
    expect(validarRuc(rucNatural)).toBe(false);

    const badPrivate = "0991234560001";
    expect(validarRuc(badPrivate)).toBe(false);

    const badPublic = "116123450001";
    expect(validarRuc(badPublic)).toBe(false);
  });
});
