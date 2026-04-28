import { describe, expect, it } from "vitest";
import { Vertical, WithHref } from "../../../stories/layout/benefits.stories";

describe("Benefits stories", () => {
  it("defines Vertical story with vertical layout", () => {
    expect(Vertical.args?.layout).toBe("vertical");
    expect(Vertical.args?.benefits).toHaveLength(3);
    expect(Vertical.parameters?.layout).toBe("fullscreen");
  });

  it("defines WithHref story with href and isExternal on each item", () => {
    expect(WithHref.args?.layout).toBe("vertical");
    expect(WithHref.args?.benefits).toHaveLength(3);

    const items = WithHref.args?.benefits ?? [];
    expect(items[0].href).toBe("/internet-hogar");
    expect(items[0].isExternal).toBe(false);
    expect(items[1].href).toBe("/internet-empresarial");
    expect(items[1].isExternal).toBe(false);
    expect(items[2].href).toBe("https://clientes.xtrim.net");
    expect(items[2].isExternal).toBe(true);
  });
});
