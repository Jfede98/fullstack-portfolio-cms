import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "@shared-ui/components/cards/base";

describe("Card component", () => {
  it("renders as a div by default", () => {
    render(<Card>Default Card</Card>);
    const card = screen.getByText("Default Card");

    expect(card.tagName).toBe("DIV");
    expect(card.className).toContain("bg-white");
    expect(card.textContent).toBe("Default Card");
  });

  it("renders as an anchor when href is provided", () => {
    const href = "https://example.com";
    render(<Card href={href}>Link Card</Card>);
    const card = screen.getByText("Link Card") as HTMLAnchorElement;

    expect(card.tagName).toBe("A");
    expect(card.href).toContain(href);
    expect(card.textContent).toBe("Link Card");
  });

  it("applies custom className.base", () => {
    render(<Card className={{ base: "my-custom-card" }}>Styled Card</Card>);
    const card = screen.getByText("Styled Card");

    expect(card.className).toContain("my-custom-card");
  });

  it("renders children correctly", () => {
    render(<Card>Child Content</Card>);
    const card = screen.getByText("Child Content");

    expect(card.textContent).toBe("Child Content");
  });
});
