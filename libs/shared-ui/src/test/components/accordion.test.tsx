import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Accordion } from "@shared-ui/components/accordion";
import type { IAccordionProps } from "@shared-ui/interfaces/accordion";
import type { ReactNode } from "react";

vi.mock("@shared-ui/components/dropdown", () => ({
  Dropdown: ({ trigger, content, onActive, active }: any) => (
    <div>
      <button
        data-testid="dropdown-trigger"
        onClick={() => onActive?.(!active)}
      >
        {trigger}
      </button>
      {active && <div data-testid="dropdown-content">{content}</div>}
    </div>
  )
}));

vi.mock("@shared-ui/components/link", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) => (
    <a data-testid="accordion-link" href={href}>
      {children}
    </a>
  )
}));

vi.mock("../markdown", () => ({
  MarkdownItem: ({ desc }: any) => <div data-testid="markdown-item">{desc}</div>
}));

describe("Accordion", () => {
  const baseProps: IAccordionProps = {
    items: [
      {
        title: "Item 1",
        description: "Desc 1"
      },
      {
        title: "Item 2",
        description: "Desc 2"
      }
    ]
  };

  it("renders accordion container", () => {
    const { container } = render(<Accordion {...baseProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders dropdown items when no link is provided", () => {
    render(<Accordion {...baseProps} />);
    expect(screen.getAllByTestId("dropdown-trigger").length).toBe(2);
  });

  it("renders Link when item has link", () => {
    render(
      <Accordion
        items={[
          {
            title: "Link item",
            link: { href: "/test" }
          }
        ]}
      />
    );

    const link = screen.getByTestId("accordion-link");
    expect(link).toBeTruthy();
  });

  it("renders children instead of MarkdownItem when provided", () => {
    render(
      <Accordion
        items={[
          {
            title: "With children",
            children: <div data-testid="custom-children">Custom</div>
          }
        ]}
        isExclusive
      />
    );

    fireEvent.click(screen.getByTestId("dropdown-trigger"));
    expect(screen.getByTestId("custom-children")).toBeTruthy();
  });

  it("handles exclusive behavior correctly", () => {
    render(<Accordion {...baseProps} isExclusive />);

    const triggers = screen.getAllByTestId("dropdown-trigger");

    fireEvent.click(triggers[0]);
    expect(screen.getAllByTestId("dropdown-content").length).toBe(1);

    fireEvent.click(triggers[1]);
    expect(screen.getAllByTestId("dropdown-content").length).toBe(1);
  });

  it("renders MarkdownItem when no children are provided", () => {
    render(<Accordion {...baseProps} isExclusive />);

    fireEvent.click(screen.getAllByTestId("dropdown-trigger")[0]);

    expect(screen.getByTestId("markdown-item")).toBeTruthy();
  });
});
