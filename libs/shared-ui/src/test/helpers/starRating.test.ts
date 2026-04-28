import { describe, it, expect } from "vitest";
import { generateStarRating } from "../../lib/helpers/starRating";

describe("generateStarRating", () => {
  it("throws if rating is less than 0", () => {
    expect(() => generateStarRating(-1)).toThrow(
      "El rating debe estar entre 0 y 5"
    );
  });

  it("throws if rating is greater than 5", () => {
    expect(() => generateStarRating(5.5)).toThrow(
      "El rating debe estar entre 0 y 5"
    );
  });

  it("throws if rating is not multiple of 0.5", () => {
    expect(() => generateStarRating(1.3)).toThrow(
      "El rating debe ser múltiplo de 0.5"
    );
  });

  it("returns correct stars for integer rating", () => {
    expect(generateStarRating(0)).toEqual([]);
    expect(generateStarRating(1)).toEqual([{ type: "star" }]);
    expect(generateStarRating(3)).toEqual([
      { type: "star" },
      { type: "star" },
      { type: "star" }
    ]);
  });

  it("returns correct stars for half ratings", () => {
    expect(generateStarRating(0.5)).toEqual([{ type: "star_half" }]);
    expect(generateStarRating(2.5)).toEqual([
      { type: "star" },
      { type: "star" },
      { type: "star_half" }
    ]);
    expect(generateStarRating(4.5)).toEqual([
      { type: "star" },
      { type: "star" },
      { type: "star" },
      { type: "star" },
      { type: "star_half" }
    ]);
  });
});
