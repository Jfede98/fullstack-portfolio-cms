import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TwoColumns } from "@shared-ui/components/twoColumns";

const leftContent = <div data-testid="left-content">Left</div>;
const rightContent = <div data-testid="right-content">Right</div>;

describe("TwoColumns", () => {
  it("renders left and right content", () => {
    render(<TwoColumns left={leftContent} right={rightContent} />);

    expect(screen.getByTestId("two-columns")).toBeTruthy();
    expect(screen.getByTestId("left-content")).toBeTruthy();
    expect(screen.getByTestId("right-content")).toBeTruthy();
  });

  it("renders divider with configured color", () => {
    const { container } = render(
      <TwoColumns
        left={leftContent}
        right={rightContent}
        showDivider
        dividerColor="#B7B7B9"
      />
    );

    const divider = container.querySelector('[aria-hidden="true"]') as HTMLDivElement;
    expect(divider).toBeTruthy();
    expect(divider.style.backgroundColor).toBe("rgb(183, 183, 185)");
  });

  it("falls back to default divider color when color is invalid", () => {
    const { container } = render(
      <TwoColumns
        left={leftContent}
        right={rightContent}
        showDivider
        dividerColor="invalid-color"
      />
    );

    const divider = container.querySelector('[aria-hidden="true"]') as HTMLDivElement;
    expect(divider.style.backgroundColor).toBe("rgb(183, 183, 185)");
  });

  it("applies center spacing classes when divider is enabled", () => {
    const { container } = render(
      <TwoColumns
        left={leftContent}
        right={rightContent}
        showDivider
        leftWidth="50%"
        rightWidth="50%"
      />
    );

    const columns = container.querySelectorAll('[data-testid="two-columns"] > div > div');
    const leftColumn = columns[0] as HTMLDivElement;
    const rightColumn = columns[2] as HTMLDivElement;

    expect(leftColumn.className).toContain("lg:pr-6");
    expect(rightColumn.className).toContain("lg:pl-6");
  });

  it("normalizes numeric width values into percentages", () => {
    const { container } = render(
      <TwoColumns left={leftContent} right={rightContent} leftWidth="50" rightWidth="50" />
    );

    const columns = container.querySelectorAll('[data-testid="two-columns"] > div > div');
    const leftColumn = columns[0] as HTMLDivElement;
    const rightColumn = columns[1] as HTMLDivElement;

    expect(leftColumn.style.getPropertyValue("--two-columns-left-width")).toBe("50%");
    expect(rightColumn.style.getPropertyValue("--two-columns-right-width")).toBe("50%");
  });

  it("normalizes percentages when total width exceeds 100", () => {
    const { container } = render(
      <TwoColumns left={leftContent} right={rightContent} leftWidth="60%" rightWidth="50%" />
    );

    const columns = container.querySelectorAll('[data-testid="two-columns"] > div > div');
    const leftColumn = columns[0] as HTMLDivElement;
    const rightColumn = columns[1] as HTMLDivElement;

    expect(leftColumn.style.getPropertyValue("--two-columns-left-width")).toBe("54.545%");
    expect(rightColumn.style.getPropertyValue("--two-columns-right-width")).toBe("45.455%");
  });
});
