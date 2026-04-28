import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@shared-ui/components/badge";

describe("Badge", () => {
  it("renders the provided text", () => {
    render(<Badge text="New!" />);
    const badge = screen.getByTestId("badge");
    expect(badge.textContent).to.equal("New!");
  });

  it("applies custom className.base", () => {
    render(<Badge text="Test" className={{ base: "custom-class" }} />);
    const badge = screen.getByTestId("badge");
    expect(badge.className).to.include("custom-class");
  });

  it("applies BadgeStyle classes based on props", () => {
    render(<Badge text="Featured" color="primary" />);
    const badge = screen.getByTestId("badge");
    const classes = badge.className;
    expect(classes).to.include("primary");
  });
});
