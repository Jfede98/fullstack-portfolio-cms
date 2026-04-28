import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { Arrow } from "@shared-ui/components/carousel/arrow";
import * as buttonHelpers from "@shared-ui/helpers/button";

describe("Arrow component", () => {
  const defaultProps = {
    id: "arrow-left",
    direction: "left" as const,
    size: "md" as const,
    className: { base: "custom-base", icon: "custom-icon" }
  };

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the container with custom className", () => {
    render(<Arrow {...defaultProps} />);
    const container =
      screen.getByTestId("arrow-container") ||
      document.getElementById(defaultProps.id);
    expect(container).to.exist;
    expect(container?.className).to.include("custom-base");
  });

  it("renders the icon div with custom className", () => {
    render(<Arrow {...defaultProps} />);
    const container =
      screen.getByTestId("arrow-container") ||
      document.getElementById(defaultProps.id);
    const iconDiv =
      screen.getByTestId("arrow-icon") || container?.querySelector("div");
    expect(iconDiv).to.exist;
    expect(iconDiv?.className).to.include("custom-icon");
  });

  it("calls createRipple on click when not disabled", () => {
    const rippleSpy = vi.spyOn(buttonHelpers, "createRipple");

    render(<Arrow {...defaultProps} />);

    const container = screen.getByTestId("arrow-container");
    fireEvent.click(container);

    expect(rippleSpy).toHaveBeenCalledTimes(1);

    rippleSpy.mockRestore();
  });

  it("does not trigger ripple when disabled", () => {
    const rippleSpy = vi.spyOn(buttonHelpers, "createRipple");

    render(<Arrow {...defaultProps} disabled />);

    const container = screen.getByTestId("arrow-container");
    fireEvent.click(container);

    expect(rippleSpy).toHaveBeenCalledTimes(0);

    rippleSpy.mockRestore();
  });
});
