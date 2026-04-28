import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "@shared-ui/components/icons";

describe("Icon", () => {
  it("renders material icon names as text", () => {
    render(<Icon name="search" dataTestid="icon" />);

    expect(screen.getByTestId("icon").textContent).toBe("search");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("renders WhatsappVector inline so it inherits icon size and color", () => {
    render(
      <Icon
        name="WhatsappVector"
        size="xl"
        color="text-primary-500"
        dataTestid="icon"
      />
    );

    const wrapper = screen.getByTestId("icon");
    const svg = wrapper.querySelector("svg");
    const path = wrapper.querySelector("path");

    expect(wrapper.className).toContain("text-[40px]");
    expect(wrapper.className).toContain("text-primary-500");
    expect(screen.queryByRole("img")).toBeNull();
    expect(svg?.getAttribute("width")).toBe("1em");
    expect(svg?.getAttribute("height")).toBe("1em");
    expect(path?.getAttribute("fill")).toBe("currentColor");
  });
});
