import { renderHook } from "@testing-library/react";
import { usePlanPlanCard } from "@hooks/useClientPlanCard";
import { ModalContext } from "@context/modal";
import { FormContactContext } from "@context/formContact";
import { SemiautomaticFlowContext } from "@context/semiautomaticFlow";


const addEvent = jest.fn();
const runLeadButtonAction = jest.fn();

jest.mock("@hooks/useGtm", () => ({
  useGtm: () => ({ addEvent })
}));

jest.mock("@hooks/useCustomPathname", () => ({
  useCustomPathname: () => "home"
}));
jest.mock("@hooks/useLeadButtonAction", () => ({
  useLeadButtonAction: () => ({ runLeadButtonAction })
}));

const buildWrapper = (overrides?: {
  goToNextStep?: () => void;
  selectPlan?: (plan: any) => void;
  setPlan?: jest.Mock;
  modalState?: boolean;
}) => {
  const setPlan = overrides?.setPlan ?? jest.fn();
  const goToNextStep = overrides?.goToNextStep ?? jest.fn();
  const selectPlan = overrides?.selectPlan ?? jest.fn();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ModalContext.Provider value={{ state: overrides?.modalState ?? false, handlerState: jest.fn() }}>
      <FormContactContext.Provider value={{ setPlan }}>
        <SemiautomaticFlowContext.Provider value={{ onAddressChange: jest.fn(), goToNextStep, selectPlan, isActive: false }}>
          {children}
        </SemiautomaticFlowContext.Provider>
      </FormContactContext.Provider>
    </ModalContext.Provider>
  );

  return { wrapper, setPlan, goToNextStep, selectPlan };
};

describe("usePlanPlanCard", () => {
  beforeEach(() => {
    addEvent.mockReset();
    runLeadButtonAction.mockReset();
  });

  it("handles button actions and trigger", () => {
    const { wrapper, setPlan } = buildWrapper();

    const { result } = renderHook(
      () => usePlanPlanCard({ name: "Plan 1" } as any),
      { wrapper }
    );

    const modalButton = { identifier: 0 };
    const contractHandler = result.current.handlerButton(modalButton as any);

    contractHandler?.();
    expect(runLeadButtonAction).toHaveBeenCalledWith(
      expect.objectContaining({
        button: modalButton,
        section: "plan",
        onModal: expect.any(Function),
        onWhatsapp: expect.any(Function),
        onSemiautomaticFlow: expect.any(Function)
      })
    );

    const params = runLeadButtonAction.mock.calls[0][0];
    params.onModal();
    expect(setPlan).toHaveBeenCalled();
    expect(addEvent).toHaveBeenCalledWith(
      expect.objectContaining({ event: "open_form", section: "plan" })
    );

    params.onWhatsapp();
    expect(addEvent).toHaveBeenCalledWith(
      expect.objectContaining({ event: "working_lead", section: "plan" })
    );

    result.current.handlerTrigger();
    expect(addEvent).toHaveBeenCalled();
  });

  it("calls selectPlan and goToNextStep when onSemiautomaticFlow fires", () => {
    const goToNextStep = jest.fn();
    const selectPlan = jest.fn();
    const plan = { name: "Plan Fibra", speedValue: "200", speedUnit: "Mbps" } as any;

    const { wrapper } = buildWrapper({ goToNextStep, selectPlan });
    const { result } = renderHook(() => usePlanPlanCard(plan), { wrapper });

    result.current.handlerButton({ identifier: 3 } as any)();

    const params = runLeadButtonAction.mock.calls[0][0];
    params.onSemiautomaticFlow();

    expect(selectPlan).toHaveBeenCalledWith(plan);
    expect(goToNextStep).toHaveBeenCalled();
  });

  it("does not reset plan when modal is already open", () => {
    const setPlan = jest.fn();
    const { wrapper } = buildWrapper({ setPlan, modalState: true });

    renderHook(() => usePlanPlanCard({ id: "1", speedUnit: "Mbps" } as any), {
      wrapper
    });

    expect(setPlan).not.toHaveBeenCalledWith(undefined);
  });

  it("handles handlerButton when isActive is true and identifier is 0", () => {
    const goToNextStep = jest.fn();
    const selectPlan = jest.fn();
    const plan = { name: "Active Flow Plan" } as any;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider value={{ state: false, handlerState: jest.fn() }}>
        <FormContactContext.Provider value={{ setPlan: undefined }}>
          <SemiautomaticFlowContext.Provider value={{ onAddressChange: jest.fn(), goToNextStep, selectPlan, isActive: true }}>
            {children}
          </SemiautomaticFlowContext.Provider>
        </FormContactContext.Provider>
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => usePlanPlanCard(plan), { wrapper });

    result.current.handlerButton({ identifier: 0 } as any)();

    expect(selectPlan).toHaveBeenCalledWith(plan);
    expect(goToNextStep).toHaveBeenCalled();
    expect(addEvent).toHaveBeenCalledWith(
      expect.objectContaining({ event: "open_form", section: "plan" })
    );
  });

  it("calls onModal safely when setPlan is undefined", () => {
    const goToNextStep = jest.fn();
    const selectPlan = jest.fn();
    const plan = { name: "Test fallbacks", priceInfo: { amount: "10*" } } as any;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FormContactContext.Provider value={{ setPlan: undefined }}>
        <SemiautomaticFlowContext.Provider value={{ onAddressChange: jest.fn(), goToNextStep, selectPlan, isActive: false }}>
          {children}
        </SemiautomaticFlowContext.Provider>
      </FormContactContext.Provider>
    );

    const { result } = renderHook(() => usePlanPlanCard(plan), { wrapper });

    result.current.handlerButton({ identifier: 1 } as any)();

    const params = runLeadButtonAction.mock.calls[0][0];
    expect(() => params.onModal()).not.toThrow();
  });
});
