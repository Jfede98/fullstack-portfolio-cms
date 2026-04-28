import { describe, it, expect } from "vitest";
import { Screen } from "@shared-ui/constants/state";

describe("Screen enum", () => {
  it("debe tener los valores correctos", () => {
    expect(Screen.msm).toBe(375);
    expect(Screen.sm).toBe(576);
    expect(Screen.md).toBe(768);
    expect(Screen.lg).toBe(992);
    expect(Screen.xl).toBe(1200);
    expect(Screen.xxl).toBe(1400);
  });

  it("puede mapear clave a valor y valor a clave", () => {
    expect(Screen[375]).toBe("msm");
    expect(Screen[576]).toBe("sm");
    expect(Screen[768]).toBe("md");
    expect(Screen[992]).toBe("lg");
    expect(Screen[1200]).toBe("xl");
    expect(Screen[1400]).toBe("xxl");
  });

  it("no tiene claves extrañas", () => {
    const keys = Object.keys(Screen).filter((k) => isNaN(Number(k)));
    expect(keys).toEqual(["msm", "sm", "md", "lg", "xl", "xxl"]);
  });
});
