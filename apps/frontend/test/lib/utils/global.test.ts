import { isValidString } from "@lib/utils/global";

describe("isValidString", () => {
  it("returns true for non-empty strings", () => {
    expect(isValidString("ok")).toBe(true);
  });

  it("returns false for empty or non-string values", () => {
    expect(isValidString("")).toBe(false);
    expect(isValidString("   ")).toBe(false);
    expect(isValidString(null)).toBe(false);
  });
});
