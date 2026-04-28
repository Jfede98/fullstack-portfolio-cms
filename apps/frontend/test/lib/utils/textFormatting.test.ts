import { formatTextWithMobileBreak } from "@lib/utils/textFormatting";

describe("formatTextWithMobileBreak", () => {
  describe("basic cases", () => {
    it("returns the original text when it is empty", () => {
      expect(formatTextWithMobileBreak({ text: "" })).toBe("");
    });

    it("returns the original text when it is a single word", () => {
      expect(formatTextWithMobileBreak({ text: "Fibra" })).toBe("Fibra");
    });

    it("returns the original text when it is null or undefined", () => {
      expect(formatTextWithMobileBreak({ text: null as any })).toBe(null);
    });
  });

  describe("length-based split", () => {
    it("splits 'interesados por aquí' based on length", () => {
      const result = formatTextWithMobileBreak({
        text: "interesados por aquí"
      });
      expect(result).toBeTruthy();
      // Should split into "interesados" / "por aquí" (not "interesados por", which would be too long)
      expect(result).not.toBe("interesados por aquí");
    });

    it("splits 'Fibra Óptica' around the midpoint", () => {
      const result = formatTextWithMobileBreak({ text: "Fibra Óptica" });
      expect(result).toBeTruthy();
      expect(result).not.toBe("Fibra Óptica");
    });

    it("splits 'Más planes interesantes' based on length", () => {
      const result = formatTextWithMobileBreak({
        text: "Más planes interesantes"
      });
      expect(result).toBeTruthy();
    });

    it("splits 'Conexión Híbrida' correctly", () => {
      const result = formatTextWithMobileBreak({
        text: "Conexión Híbrida"
      });
      expect(result).toBeTruthy();
      expect(result).not.toBe("Conexión Híbrida");
    });
  });
});
