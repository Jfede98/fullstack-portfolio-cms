import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Benefits } from "@shared-ui/components/benefits";

describe("Benefits", () => {
  const benefitsData = [
    { icon: "star", title: "Fast", description: "Very fast" },
    { icon: "shield", title: "Secure", description: "Highly secure" }
  ];

  it("renders the main title", () => {
    render(
      <Benefits title={{ text: "Our Benefits", tag: "h2" }} benefits={benefitsData} />
    );
    const title = screen.getByTestId("benefits-title");
    expect(title.textContent).to.equal("Our Benefits");
  });

  it("renders all benefits items with title, description and icon", () => {
    render(
      <Benefits title={{ text: "Benefits", tag: "h2" }} benefits={benefitsData} />
    );
    const items = screen.getAllByTestId("benefit-item");
    expect(items.length).to.equal(2);

    items.forEach((item, idx) => {
      const title = item.querySelector('[data-testid="benefit-title"]');
      const desc = item.querySelector('[data-testid="benefit-description"]');
      const iconContainer = item.querySelector(
        '[data-testid="benefit-icon-container"]'
      );

      expect(title?.textContent).to.equal(benefitsData[idx].title);
      expect(desc?.textContent).to.equal(benefitsData[idx].description);
      expect(iconContainer).toBeTruthy();
    });
  });

  it("aligns horizontal benefit items from the top", () => {
    render(
      <Benefits title={{ text: "Benefits", tag: "h2" }} benefits={benefitsData} />
    );

    const container = screen.getByTestId("benefits-container");

    expect(container.classList.contains("items-start")).toBe(true);
    expect(container.classList.contains("items-center")).toBe(false);
  });

  it("applies custom className props", () => {
    render(
      <Benefits
        title={{ text: "Custom Classes", tag: "h2" }}
        benefits={benefitsData}
        className={{
          base: "base-class",
          titleStyle: "title-class",
          benefitItemStyle: "item-class"
        }}
      />
    );
    const container = screen.getByTestId("benefits");
    const title = screen.getByTestId("benefits-title");
    const firstItem = screen.getAllByTestId("benefit-item")[0];

    expect(container.className).to.include("base-class");
    expect(title.className).to.include("title-class");
    expect(firstItem.className).to.include("item-class");
  });

  it("applies vertical layout classes", () => {
    render(
      <Benefits
        title={{ text: "Vertical", tag: "h2" }}
        benefits={benefitsData}
        layout="vertical"
      />
    );

    const container = screen.getByTestId("benefits");
    const description = screen.getAllByTestId("benefit-description")[0];

    expect(container.className).to.include("md:px-16");
    expect(description.className).to.include("text-left");
    expect(description.className).to.include("text-2xs");
    expect(description.className).to.not.include("hidden");
  });

  it("does not render title when it is missing", () => {
    render(<Benefits benefits={benefitsData} />);
    expect(screen.queryByTestId("benefits-title")).toBeNull();
  });

  it("does not render empty benefit title/description nodes", () => {
    render(
      <Benefits
        benefits={[
          { icon: "network_check", title: "", description: "Only description" },
          { icon: "timer", title: "Only title", description: "" }
        ]}
      />
    );

    const items = screen.getAllByTestId("benefit-item");
    expect(items[0].querySelector('[data-testid="benefit-title"]')).toBeNull();
    expect(items[1].querySelector('[data-testid="benefit-description"]')).toBeNull();
  });

  it("wraps benefit item in <a> when href is provided", () => {
    render(
      <Benefits
        benefits={[
          { icon: "wifi", title: "Con enlace", description: "Desc", href: "/hogar", isExternal: false },
          { icon: "star", title: "Sin enlace", description: "Desc" }
        ]}
      />
    );

    const items = screen.getAllByTestId("benefit-item");
    expect(items[0].tagName.toLowerCase()).toBe("a");
    expect(items[0].getAttribute("href")).toBe("/hogar");
    expect(items[0].hasAttribute("target")).toBe(false);
    expect(items[1].tagName.toLowerCase()).toBe("div");
  });

  it("adds target=_blank and rel=noopener when isExternal is true", () => {
    render(
      <Benefits
        benefits={[
          { icon: "open_in_new", title: "Externo", description: "Desc", href: "https://ext.com", isExternal: true }
        ]}
      />
    );

    const item = screen.getByTestId("benefit-item");
    expect(item.tagName.toLowerCase()).toBe("a");
    expect(item.getAttribute("target")).toBe("_blank");
    expect(item.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
