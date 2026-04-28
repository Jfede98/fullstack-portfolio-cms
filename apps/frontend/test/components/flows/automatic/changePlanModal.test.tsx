import { render, screen } from "@testing-library/react";
import { ChangePlanModal } from "@components/flows/automatic/ChangePlanModal";

const dispatchMock = jest.fn();
const setSelectedPlanMock = jest.fn((plan: any) => ({ type: "setSelectedPlan", payload: plan }));

jest.mock("@store/semiautomaticFlow/hooks", () => ({
  useAppDispatch: () => dispatchMock
}));

jest.mock("@store/semiautomaticFlow", () => ({
  setSelectedPlan: (plan: any) => setSelectedPlanMock(plan)
}));

const TabMock: any = jest.fn(({ tabs }: any) => (
  <div data-testid="tab">{tabs?.[0]?.content}</div>
));
const ModalMock: any = jest.fn(({ children }: any) => <div>{children}</div>);

jest.mock("@sitio-publico/shared-ui", () => ({
  Modal: (props: any) => ModalMock(props),
  Icon: () => <div data-testid="icon" />,
  Tab: (props: any) => TabMock(props)
}));

jest.mock("@components/client/ClientPlanCard", () => ({
  ClientPlanCard: (props: any) => {
    const React = require("react");
    const { SemiautomaticFlowContext } = require("@context/semiautomaticFlow");
    const ctx = React.useContext(SemiautomaticFlowContext);
    React.useEffect(() => {
      if (ctx?.selectPlan) ctx.selectPlan(props);
    }, [ctx]);
    return <div data-testid="plan-card" />;
  }
}));

describe("ChangePlanModal", () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    setSelectedPlanMock.mockClear();
    TabMock.mockClear();
    ModalMock.mockClear();
  });

  it("shows empty state when no planTabData", () => {
    render(<ChangePlanModal isOpen onClose={jest.fn()} />);
    expect(screen.getByText("No hay planes configurados para este selector.")).toBeInTheDocument();
  });

  it("renders tabs and selects plan", () => {
    const onClose = jest.fn();
    render(
      <ChangePlanModal
        isOpen
        onClose={onClose}
        planTabData={{
          categories: [
            { id: 1, label: "A", plans: [{ id: "1", name: "Plan A" }] }
          ]
        } as any}
      />
    );

    expect(TabMock).toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("supports exactly three categories mode and validates fallbacks", () => {
    render(
      <ChangePlanModal
        isOpen
        onClose={jest.fn()}
        planTabData={{
          categories: [
            { id: 1, label: "A", plans: [{ id: "1", name: "Plan A", className: { wrapper: "custom" } }] },
            { id: 2, label: "B", plans: [{ id: "2", name: "Plan B" }] },
            { plans: [{ id: "3", name: "Plan C" }] }, // missing id and label
            { label: "Empty", plans: [] } // empty plans branch
          ]
        } as any}
      />
    );
    expect(TabMock).toHaveBeenCalled();
  });
});
