import { describe, expect, it } from "vitest";
import { clampStep, resolveStepStatus } from "@shared-ui/helpers/stepper";

describe("Stepper helpers", () => {
  describe("clampStep", () => {
    it("returns 0 when max is negative", () => {
      expect(clampStep(2, -1)).toBe(0);
    });

    it("clamps step below 0", () => {
      expect(clampStep(-2, 3)).toBe(0);
    });

    it("clamps step above max", () => {
      expect(clampStep(10, 3)).toBe(3);
    });

    it("keeps step when it is in range", () => {
      expect(clampStep(2, 3)).toBe(2);
    });
  });

  describe("resolveStepStatus", () => {
    it("returns active for current step", () => {
      expect(resolveStepStatus(1, 1)).toBe("active");
    });

    it("returns completed for previous step", () => {
      expect(resolveStepStatus(2, 1)).toBe("completed");
    });

    it("returns pending for next step", () => {
      expect(resolveStepStatus(1, 2)).toBe("pending");
    });
  });
});
