import { render } from "@testing-library/react";
import { ClientPlanCard } from "@components/client/ClientPlanCard";
import type { IPlanCardProps } from "@sitio-publico/shared-ui";

const handlerButton = jest.fn(() => jest.fn());
const handlerTrigger = jest.fn();
const PlanCardMock: any = jest.fn(() => <div data-testid="plan-card" />);

jest.mock("@hooks/useClientPlanCard", () => ({
  usePlanPlanCard: () => ({ handlerButton, handlerTrigger })
}));

jest.mock("@sitio-publico/shared-ui", () => ({
  PlanCard: (props: any) => PlanCardMock(props)
}));

describe("ClientPlanCard", () => {
  let props: IPlanCardProps;

  beforeAll(() => {
    props = {
      name: "Plan",
      speedValue: "100",
      speedUnit: "Mbps",
      ctaButtons: [{ label: "Comprar", identifier: 1 } as any],
      priceInfo: {
        amount: "100",
        taxLabel: "IVA",
        originalPrice: "100",
        legalDisclaimer: "Legal Disclaimer",
        promoLabel: "Promoción"
      },
      benefits: [],
      apps: []
    };
  });

  it("maps cta buttons and trigger handler", () => {
    render(<ClientPlanCard {...props} />);

    const mockProps = PlanCardMock.mock.calls[0][0];
    expect(typeof mockProps.ctaButtons[0].onClick).toBe("function");
    expect(mockProps.triggerOnActive).toBe(handlerTrigger);
  });

  it("defaults identifier to 0 when missing", () => {
    handlerButton.mockClear();
    render(
      <ClientPlanCard {...props} ctaButtons={[{ label: "Comprar" } as any]} />
    );

    expect(handlerButton).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Comprar" })
    );
  });

  it("removes leadFormSelection from rendered cta button props", () => {
    PlanCardMock.mockClear();
    render(
      <ClientPlanCard
        {...props}
        ctaButtons={[
          {
            label: "Comprar",
            identifier: 0,
            leadFormSelection: { leadFormDocumentId: "doc-1" }
          } as any
        ]}
      />
    );

    const mockProps = PlanCardMock.mock.calls[0][0];
    expect(mockProps.ctaButtons[0]).not.toHaveProperty("leadFormSelection");
    expect(typeof mockProps.ctaButtons[0].onClick).toBe("function");
  });
});
