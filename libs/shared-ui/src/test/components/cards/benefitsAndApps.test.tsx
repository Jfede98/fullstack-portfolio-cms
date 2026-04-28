import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BenefitsAndApps } from "@shared-ui/components/cards/benefitsAndApps";
import type { IBenefitsAndAppsProps } from "@shared-ui/interfaces/cards/planCard";

const defaultProps: IBenefitsAndAppsProps = {
  benefits: [
    { name: "Beneficio 1", icon: "check_circle" },
    { name: "Beneficio 2", icon: "check_circle" }
  ],
  apps: [
    { name: "App 1", icon: "app1", description: "Desc 1" },
    { name: "App 2", icon: "app2", description: "Desc 2" }
  ],
  className: {
    benefitsContainer: "custom-benefits",
    benefitItem: "custom-benefit-item",
    appsLabel: "custom-apps-label",
    appsContainer: "custom-apps-container",
    appItem: "custom-app-item",
    divider: "custom-divider"
  }
};

describe("BenefitsAndApps component", () => {
  it("renders benefits correctly", () => {
    render(<BenefitsAndApps {...defaultProps} />);
    const benefitsContainer = screen.getByText("Beneficio 1").parentElement;
    expect(benefitsContainer).to.exist;
    expect(benefitsContainer?.className).to.include("custom-benefit-item");

    const benefitIcons = screen.getAllByRole("img"); // suponer que Icon renderiza <img>
    expect(benefitIcons.length).to.equal(defaultProps.benefits.length);
  });

  it("renders apps correctly", () => {
    render(<BenefitsAndApps {...defaultProps} />);

    const appsContainer = screen.getByTestId("apps-container");
    expect(appsContainer.className).to.include("custom-apps-container");

    const app1 = screen.getByTestId("app-item-0");
    expect(app1).to.exist;
    expect(screen.getByAltText("icon-app1")).to.exist;

    const app2 = screen.getByText("App 2");
    expect(app2).to.exist;
  });

  it("uses provided imageAlt for custom app icons", () => {
    render(
      <BenefitsAndApps
        benefits={[]}
        apps={[
          {
            name: "App CMS",
            description: "Desc",
            useCustomIcon: true,
            url: "https://cdn.example.com/logo.png",
            imageAlt: "Logo App CMS"
          }
        ]}
      />
    );

    expect(screen.getByAltText("Logo App CMS")).to.exist;
  });

  it("keeps empty alt text for decorative custom app icons", () => {
    const { container } = render(
      <BenefitsAndApps
        benefits={[]}
        apps={[
          {
            name: "App Decorativa",
            description: "Desc",
            useCustomIcon: true,
            url: "https://cdn.example.com/logo.png",
            imageAlt: ""
          }
        ]}
      />
    );

    const icon = container.querySelector("img[alt='']");
    expect(icon).to.exist;
  });

  it("renders divider", () => {
    render(<BenefitsAndApps benefits={[]} apps={[]} />);
    const divider = screen.getByTestId("divider");
    expect(divider).to.exist;
  });

  it("handles empty benefits or apps gracefully", () => {
    render(<BenefitsAndApps benefits={[]} apps={[]} />);
    expect(screen.queryByText("Incluye:")).to.be.null;
  });
});
