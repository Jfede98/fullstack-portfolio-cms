import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlanCard } from "@shared-ui/components/cards/planCard";
import type { IPlanCardProps } from "@shared-ui/interfaces/cards/planCard.ts";

const props: IPlanCardProps = {
  name: "Plan Premium",
  speedValue: "500",
  speedUnit: "Mbps",
  isRecommended: true,
  isRecommendedText: "POP",
  priceInfo: {
    amount: "49.99",
    taxLabel: "IVA incluido",
    originalPrice: "59.99",
    legalDisclaimer: "Términos y condiciones aplican",
    promoLabel: "Oferta especial"
  },
  ctaButtons: [
    { label: "Comprar", type: "primary" },
    { label: "Más info", href: "/info", type: "secondary" }
  ],
  benefits: [
    { name: "Beneficio 1", icon: "check_circle" },
    { name: "Beneficio 2", icon: "check_circle" }
  ],
  apps: [
    { name: "App 1", icon: "app1" },
    { name: "App 2", icon: "app2" }
  ],
  detailsContent: "Detalles adicionales",
  className: {
    wrapper: "custom-wrapper",
    topContainer: "custom-top",
    midContainer: "custom-mid",
    btnContainer: "custom-btn"
  }
};

describe("PlanCard component", () => {
  it("renders wrapper with correct className", () => {
    render(<PlanCard {...props} />);
    const wrapper = screen.getByTestId("plan-card-wrapper");
    expect(wrapper).to.exist;
    expect(wrapper.className).to.include("custom-wrapper");
  });

  it("renders recommended badge", () => {
    render(<PlanCard {...props} />);
    const badge = screen.getByTestId("plan-card-badge");
    expect(badge).to.exist;
    expect(badge.textContent).to.include("POP");
  });

  it("renders speed and plan name", () => {
    render(<PlanCard {...props} />);
    expect(screen.getByTestId("plan-card-speed-value").textContent).to.equal(
      "500"
    );
    expect(screen.getByTestId("plan-card-speed-unit").textContent).to.equal(
      "Mbps"
    );
    expect(screen.getByTestId("plan-card-name").textContent).to.equal(
      "Plan Premium"
    );
  });

  it("renders price info", () => {
    render(<PlanCard {...props} />);
    expect(screen.getByTestId("plan-card-amount").textContent).to.equal(
      "49.99"
    );
    expect(screen.getByTestId("plan-card-tax").textContent).to.equal(
      "IVA incluido"
    );
    expect(screen.getByTestId("plan-card-original-price").textContent).to.equal(
      "59.99"
    );
    expect(screen.getByTestId("plan-card-legal").textContent).to.equal(
      "Términos y condiciones aplican"
    );
    expect(screen.getByTestId("plan-card-promo-label").textContent).to.equal(
      "Oferta especial"
    );
  });

  it("renders CTA buttons", () => {
    render(<PlanCard {...props} />);
    const btnContainer = screen.getByTestId("plan-card-cta-buttons");
    expect(btnContainer.children.length).to.equal(2);
    expect(btnContainer.textContent).to.include("Comprar");
    expect(btnContainer.textContent).to.include("Más info");
  });

  it("renders BenefitsAndApps component", () => {
    render(<PlanCard {...props} />);
    const benefits = screen.getByTestId("plan-card-benefits");
    expect(benefits).to.exist;
  });

  it("does not render empty details dropdown trigger when no content is available", () => {
    render(
      <PlanCard
        {...props}
        desktopPresentation="default"
        mobilePresentation="accordion"
        detailsContent=""
        benefits={[]}
        apps={[]}
      />
    );
    expect(screen.queryByText("Ver detalles")).to.equal(null);
  });

  it("keeps amount suffix with decimal segment in pricing presentation", () => {
    render(
      <PlanCard
        {...props}
        desktopPresentation="pricing"
        mobilePresentation="accordion"
        priceInfo={{
          ...props.priceInfo,
          amount: "$24.00*"
        }}
      />
    );
    expect(screen.getByText("00*")).to.exist;
  });
});
