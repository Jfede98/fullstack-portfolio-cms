import { render, screen } from "@testing-library/react";
import { PlanTabContent } from "@components/planTabContent";
import type { IPlanCardData } from "@interfaces/components/planTab";

jest.mock("@components/planTabContent/carousel", () => ({
  CarouselPlan: ({ data }: { data: IPlanCardData[] }) => (
    <div data-testid="carousel-plan">
      {data.map((plan, index) => (
        <div key={index} data-testid="plan-card">
          {plan.name}
        </div>
      ))}
    </div>
  )
}));

describe("PlanTabContent", () => {
  const mockPlans: IPlanCardData[] = [
    {
      name: "Plan 1",
      speedValue: "100",
      speedUnit: "Mbps",
      priceInfo: {
        amount: "$10",
        taxLabel: "+ IVA",
        originalPrice: "$15",
        legalDisclaimer: "Legal text",
        promoLabel: "Promo"
      },
      ctaButtons: [
        {
          label: "Contratar",
          type: "primary"
        }
      ],
      benefits: [],
      apps: []
    },
    {
      name: "Plan 2",
      speedValue: "200",
      speedUnit: "Mbps",
      isRecommended: true,
      priceInfo: {
        amount: "$20",
        taxLabel: "+ IVA",
        originalPrice: "$25",
        legalDisclaimer: "Legal text",
        promoLabel: "Promo"
      },
      ctaButtons: [
        {
          label: "Contratar",
          type: "primary"
        }
      ],
      benefits: [],
      apps: []
    }
  ];

  it("renders plan carousel when plans exist", () => {
    render(<PlanTabContent plans={mockPlans} />);

    expect(screen.getByTestId("carousel-plan")).toBeInTheDocument();
    expect(screen.getAllByTestId("plan-card")).toHaveLength(2);
    expect(screen.getByText("Plan 1")).toBeInTheDocument();
    expect(screen.getByText("Plan 2")).toBeInTheDocument();
  });

  it("renders nothing when plans list is empty", () => {
    const { container } = render(<PlanTabContent plans={[]} />);

    expect(container.querySelector("[data-testid='carousel-plan']")).toBeNull();
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when plans is undefined", () => {
    const { container } = render(<PlanTabContent />);

    expect(container.querySelector("[data-testid='carousel-plan']")).toBeNull();
    expect(container.firstChild).toBeNull();
  });

  it("passes correct data to CarouselPlan component", () => {
    render(<PlanTabContent plans={mockPlans} />);

    const carouselElement = screen.getByTestId("carousel-plan");
    expect(carouselElement).toBeInTheDocument();

    const planCards = screen.getAllByTestId("plan-card");
    expect(planCards).toHaveLength(mockPlans.length);
  });

  it("renders with all IPlanCategory props", () => {
    render(
      <PlanTabContent
        id={1}
        label="Fibra Óptica"
        title={{ text: "Planes de Internet" }}
        description="Los mejores planes"
        plans={mockPlans}
      />
    );

    expect(screen.getByTestId("carousel-plan")).toBeInTheDocument();
  });
});
