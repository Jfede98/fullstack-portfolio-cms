import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InfoFooter } from "@shared-ui/components/menus/footer/info";
import type { IExtraInfo } from "@shared-ui/interfaces/menus/footer";

describe("InfoFooter component", () => {
  it("renders nothing when items is undefined", () => {
    const { container } = render(<InfoFooter items={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when items is an empty array", () => {
    const { container } = render(<InfoFooter items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a single item correctly", () => {
    const items: IExtraInfo["items"] = [
      {
        label: "Dirección",
        content: "Av. Eloy Alfaro y la que cruza."
      }
    ];

    render(<InfoFooter items={items} />);

    expect(screen.getByText("Dirección")).toBeDefined();
    expect(screen.getByText("Av. Eloy Alfaro y la que cruza.")).toBeDefined();
  });

  it("renders multiple items correctly", () => {
    const items: IExtraInfo["items"] = [
      {
        label: "Dirección",
        content: "Av. Eloy Alfaro y la que cruza."
      },
      {
        label: "Horario de atención",
        content: "Lunes a Viernes de 8:30 a 18:30"
      }
    ];

    render(<InfoFooter items={items} />);

    expect(screen.getByText("Dirección")).toBeDefined();
    expect(screen.getByText("Av. Eloy Alfaro y la que cruza.")).toBeDefined();
    expect(screen.getByText("Horario de atención")).toBeDefined();
    expect(screen.getByText("Lunes a Viernes de 8:30 a 18:30")).toBeDefined();
  });

  it("renders all items in the array", () => {
    const items: IExtraInfo["items"] = [
      {
        label: "Item 1",
        content: "Content 1"
      },
      {
        label: "Item 2",
        content: "Content 2"
      },
      {
        label: "Item 3",
        content: "Content 3"
      }
    ];

    render(<InfoFooter items={items} />);

    items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeDefined();
      expect(screen.getByText(item.content)).toBeDefined();
    });
  });

  it("applies correct CSS classes to container", () => {
    const items: IExtraInfo["items"] = [
      {
        label: "Test",
        content: "Test content"
      }
    ];

    const { container } = render(<InfoFooter items={items} />);
    const infoContainer = container.querySelector("div");

    expect(infoContainer).toBeDefined();
    expect(infoContainer?.className).toContain("hidden");
    expect(infoContainer?.className).toContain("xl:flex");
    expect(infoContainer?.className).toContain("flex-col");
  });

  it("renders items with correct structure", () => {
    const items: IExtraInfo["items"] = [
      {
        label: "Test Label",
        content: "Test Content"
      }
    ];

    const { container } = render(<InfoFooter items={items} />);
    const addressContainer = container.querySelector("div > div");

    expect(addressContainer).toBeDefined();
    expect(addressContainer?.textContent).toContain("Test Label");
    expect(addressContainer?.textContent).toContain("Test Content");
  });
});
