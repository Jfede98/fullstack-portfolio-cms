import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CustomIcon } from "@shared-ui/components/customIcon";

describe("CustomIcon component", () => {
  it("renders image with provided props", () => {
    render(
      <CustomIcon
        name="xtrim"
        imageUrl="https://cdn.example.com/xtrim.png"
        imageAlt="Logo Xtrim"
        size={40}
      />
    );

    const icon = screen.getByAltText("Logo Xtrim");
    expect(icon).to.exist;
    expect(icon.getAttribute("src")).to.equal("https://cdn.example.com/xtrim.png");
    expect(icon.getAttribute("width")).to.equal("40");
    expect(icon.getAttribute("height")).to.equal("40");
  });

  it("uses name as fallback alt", () => {
    render(
      <CustomIcon
        name="Fallback Name"
        imageUrl="https://cdn.example.com/xtrim.png"
      />
    );

    expect(screen.getByAltText("Fallback Name")).to.exist;
  });

  it("preserves empty alt text when explicitly provided", () => {
    const { container } = render(
      <CustomIcon
        name="Decorative Icon"
        imageUrl="https://cdn.example.com/xtrim.png"
        imageAlt=""
      />
    );

    const icon = container.querySelector("img");
    expect(icon).to.exist;
    expect(icon?.getAttribute("alt")).to.equal("");
  });
});
