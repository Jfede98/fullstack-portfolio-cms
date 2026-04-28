import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import meta, {
  CustomDistribution,
  Default,
  WhiteBackground
} from "../../../stories/layout/twoColumns.stories";

const renderStory = (storyArgs?: Record<string, unknown>) => {
  const args = { ...(meta.args ?? {}), ...(storyArgs ?? {}) };

  if (!meta.render) {
    throw new Error("TwoColumns story meta.render is required for test rendering.");
  }

  return render(meta.render(args));
};

describe("TwoColumns stories", () => {
  it("defines default background token", () => {
    expect(Default.args?.background).toBe("primary-50");
  });

  it("defines white background variant", () => {
    expect(WhiteBackground.args?.background).toBe("white");
  });

  it("hides left and right controls in Storybook table", () => {
    expect(meta.argTypes?.left?.control).toBe(false);
    expect(meta.argTypes?.right?.control).toBe(false);
    expect(meta.argTypes?.left?.table?.disable).toBe(true);
    expect(meta.argTypes?.right?.table?.disable).toBe(true);
  });

  it("renders default story with two columns content", () => {
    renderStory(Default.args as Record<string, unknown>);

    const wrapper = screen.getByTestId("two-columns");
    expect(wrapper.className).toContain("bg-primary-50");
    expect(screen.getByText("¿Por qué elegir Xtrim?")).toBeTruthy();
    expect(screen.getByText("Solicita información")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Enviar" })).toBeTruthy();
  });

  it("renders white background variant", () => {
    renderStory(WhiteBackground.args as Record<string, unknown>);

    const wrapper = screen.getByTestId("two-columns");
    expect(wrapper.className).toContain("bg-white");
  });

  it("defines custom distribution variant", () => {
    expect(CustomDistribution.args?.showDivider).toBe(true);
    expect(CustomDistribution.args?.dividerColor).toBe("#B7B7B9");
    expect(CustomDistribution.args?.leftWidth).toBe("30%");
    expect(CustomDistribution.args?.rightWidth).toBe("40%");
  });
});
