import { describe, expect, it } from "vitest";
import {
  normalizeTwoColumnsWidth,
  normalizeTwoColumnsWidths,
  sanitizeHexColor,
  DEFAULT_TWO_COLUMNS_DIVIDER_COLOR
} from "@shared-ui/helpers/twoColumns";

describe("twoColumns helpers", () => {
  it("normalizes numeric width values to percentages", () => {
    expect(normalizeTwoColumnsWidth("50")).toBe("50%");
  });

  it("accepts valid width units and calc()", () => {
    expect(normalizeTwoColumnsWidth("30%")).toBe("30%");
    expect(normalizeTwoColumnsWidth("320px")).toBe("320px");
    expect(normalizeTwoColumnsWidth("24rem")).toBe("24rem");
    expect(normalizeTwoColumnsWidth("40vw")).toBe("40vw");
    expect(normalizeTwoColumnsWidth("calc(100% - 2rem)")).toBe("calc(100% - 2rem)");
  });

  it("drops invalid width values", () => {
    expect(normalizeTwoColumnsWidth("50/50")).toBeUndefined();
    expect(normalizeTwoColumnsWidth("auto")).toBeUndefined();
  });

  it("normalizes pair percentages when total exceeds 100", () => {
    const result = normalizeTwoColumnsWidths("60%", "50%");

    expect(result.leftWidth).toBe("54.545%");
    expect(result.rightWidth).toBe("45.455%");
  });

  it("sanitizes valid hex color and falls back for invalid", () => {
    expect(sanitizeHexColor(" #B7B7B9 ")).toBe("#B7B7B9");
    expect(sanitizeHexColor("invalid", DEFAULT_TWO_COLUMNS_DIVIDER_COLOR)).toBe(
      DEFAULT_TWO_COLUMNS_DIVIDER_COLOR
    );
  });
});
