import { renderHook, act, waitFor } from "@testing-library/react";
import { useSemiautomaticFlow } from "@hooks/useSemiautomaticFlow";
import { FormContactContext } from "@context/formContact";
import { ModalContext } from "@context/modal";
import { CityMapContext } from "@context/cityMap";
import { RenderModalType, FormContactInputType } from "@lib/constants/state";

const dispatchMock = jest.fn();
let storeState: any = {
  semiautomaticFlow: {
    leadId: null,
    phone: null,
    documentNumber: null,
    selectedPlan: null
  }
};

jest.mock("@store/semiautomaticFlow/hooks", () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: any) => selector(storeState)
}));

const setCoverageCompletedMock = jest.fn((payload: any) => ({
  type: "setCoverageCompleted",
  payload
}));
const clearSelectedPlanMock = jest.fn(() => ({ type: "clearSelectedPlan" }));
const clearLeadDataMock = jest.fn(() => ({ type: "clearLeadData" }));
const clearFlowStateMock = jest.fn();

jest.mock("@store/semiautomaticFlow", () => ({
  setSelectedPlan: (plan: any) => ({ type: "setSelectedPlan", payload: plan }),
  setCoverageCompleted: (payload: any) => setCoverageCompletedMock(payload),
  clearLeadData: () => clearLeadDataMock(),
  clearSelectedPlan: () => clearSelectedPlanMock(),
  clearFlowState: () => clearFlowStateMock()
}));

const checkCoverageByCoordsMock = jest.fn();
jest.mock("@lib/api/leads/coverage", () => ({
  checkCoverageByCoords: (...args: unknown[]) => checkCoverageByCoordsMock(...args)
}));

const sendAssistedLeadMock = jest.fn();
const updateAssistedLeadMock = jest.fn();
jest.mock("@lib/api/leads/assisted", () => ({
  sendAssistedLead: (...args: unknown[]) => sendAssistedLeadMock(...args),
  updateAssistedLead: (...args: unknown[]) => updateAssistedLeadMock(...args)
}));

jest.mock("@hooks/useCustomPathname", () => ({
  useCustomPathname: () => "home"
}));

const addEventMock = jest.fn();
jest.mock("@hooks/useGtm", () => ({
  useGtm: () => ({ addEvent: addEventMock })
}));

const routerPushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPushMock })
}));

describe("useSemiautomaticFlow", () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    dispatchMock.mockClear();
    checkCoverageByCoordsMock.mockReset();
    sendAssistedLeadMock.mockReset();
    updateAssistedLeadMock.mockReset();
    clearFlowStateMock.mockClear();
    routerPushMock.mockClear();
    addEventMock.mockClear();
    storeState = {
      semiautomaticFlow: {
        leadId: null,
        phone: null,
        documentNumber: null,
        selectedPlan: null
      }
    };
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ModalContext.Provider value={{ state: false, handlerState: jest.fn(), handlerModalType: jest.fn() }}>
      <CityMapContext.Provider
        value={{
          selectedCity: "Quito",
          selectedAddress: null,
          setSelectedCity: jest.fn(),
          setSelectedAddress: jest.fn(),
          manualPinMode: false,
          setManualPinMode: jest.fn(),
          mapProvider: "mapbox",
          mapToken: "token",
          setMapConfig: jest.fn()
        }}
      >
        <FormContactContext.Provider
          value={{
            values: {},
            setFieldValue: jest.fn(),
            validateForm: jest.fn().mockResolvedValue({}),
            setTouched: jest.fn(),
            resetForm: jest.fn(),
            setStatusType: jest.fn(),
            handlerState: jest.fn()
          } as any}
        >
          {children}
        </FormContactContext.Provider>
      </CityMapContext.Provider>
    </ModalContext.Provider>
  );

  it("handles coverage check success", async () => {
    checkCoverageByCoordsMock.mockResolvedValue({ hasCoverage: true });
    const { result } = renderHook(
      () =>
        useSemiautomaticFlow(
          [{ stepType: "step.coverage" }, { stepType: "step.final-data" }] as any,
          false
        ),
      { wrapper }
    );

    act(() => {
      result.current.onAddressChange({ latitude: 1, longitude: 2, label: "Addr" });
    });

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction?.({} as any);
    });

    expect(setCoverageCompletedMock).toHaveBeenCalledWith(true);
    expect(dispatchMock).toHaveBeenCalled();
  });

  it("dispatches selected plan and tracks event", () => {
    const { result } = renderHook(
      () =>
        useSemiautomaticFlow(
          [{ stepType: "step.coverage" }, { stepType: "step.final-data" }] as any,
          false
        ),
      { wrapper }
    );

    act(() => {
      result.current.selectPlan({ id: "p1", name: "Plan 1" } as any);
    });

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: "setSelectedPlan" })
    );
    expect(addEventMock).toHaveBeenCalled();
  });

  it("skips coverage check when no address is selected", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    const { result } = renderHook(
      () =>
        useSemiautomaticFlow(
          [{ stepType: "step.coverage" }, { stepType: "step.final-data" }] as any,
          false
        ),
      { wrapper }
    );

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction?.({} as any);
    });

    expect(checkCoverageByCoordsMock).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("sets coverage error when coverage check throws", async () => {
    checkCoverageByCoordsMock.mockRejectedValue(new Error("fail"));
    const { result } = renderHook(
      () =>
        useSemiautomaticFlow(
          [{ stepType: "step.coverage" }, { stepType: "step.final-data" }] as any,
          false
        ),
      { wrapper }
    );

    act(() => {
      result.current.onAddressChange({ latitude: 1, longitude: 2, label: "Addr" });
    });

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction?.({} as any);
    });

    expect(result.current.coverageApiError).toBe(true);
    expect(setCoverageCompletedMock).toHaveBeenCalledWith(false);
  });

  it("handles coverage error and creates lead directly", async () => {
    checkCoverageByCoordsMock.mockResolvedValue({ hasCoverage: false });
    sendAssistedLeadMock.mockResolvedValue({ success: true, id: "id1" });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();

    const customWrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider value={{ state: false, handlerState, handlerModalType }}>
        <CityMapContext.Provider
          value={{
            selectedCity: "Quito",
            selectedAddress: null,
            setSelectedCity: jest.fn(),
            setSelectedAddress: jest.fn(),
            manualPinMode: false,
            setManualPinMode: jest.fn(),
            mapProvider: "mapbox",
            mapToken: "token",
            setMapConfig: jest.fn()
          }}
        >
          <FormContactContext.Provider
            value={{
              values: { phone: "099" },
              setFieldValue: jest.fn(),
              validateForm: jest.fn().mockResolvedValue({}),
              setTouched: jest.fn(),
              resetForm: jest.fn(),
              setStatusType: jest.fn(),
              handlerState: jest.fn()
            } as any}
          >
            {children}
          </FormContactContext.Provider>
        </CityMapContext.Provider>
      </ModalContext.Provider>
    );

    const { result } = renderHook(
      () =>
        useSemiautomaticFlow(
          [{ stepType: "step.coverage" }, { stepType: "step.final-data" }] as any,
          false
        ),
      { wrapper: customWrapper }
    );

    act(() => {
      result.current.onAddressChange({ latitude: 1, longitude: 2, label: "Addr" });
    });

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction?.({} as any);
    });

    await waitFor(() => expect(result.current.coverageApiError).toBe(true));

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction?.({} as any);
    });

    expect(sendAssistedLeadMock).toHaveBeenCalled();
    expect(handlerModalType).toHaveBeenCalledWith(RenderModalType.CONTACT_FORM_STATUS);
    expect(handlerState).toHaveBeenCalledWith(true);
  });

  it("updates assisted lead on final step with leadId", async () => {
    storeState.semiautomaticFlow.leadId = "lead-1";
    updateAssistedLeadMock.mockResolvedValue({ success: true });
    const resetForm = jest.fn();

    const { result } = renderHook(
      () =>
        useSemiautomaticFlow(
          [{ stepType: "step.coverage" }, { stepType: "step.final-data" }] as any,
          false
        ),
      {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <ModalContext.Provider value={{ state: false, handlerState: jest.fn(), handlerModalType: jest.fn() }}>
            <CityMapContext.Provider
              value={{
                selectedCity: "Quito",
                selectedAddress: null,
                setSelectedCity: jest.fn(),
                setSelectedAddress: jest.fn(),
                manualPinMode: false,
                setManualPinMode: jest.fn(),
                mapProvider: "mapbox",
                mapToken: "token",
                setMapConfig: jest.fn()
              }}
            >
              <FormContactContext.Provider
                value={{
                  values: {},
                  setFieldValue: jest.fn(),
                  validateForm: jest.fn().mockResolvedValue({}),
                  setTouched: jest.fn(),
                  resetForm,
                  setStatusType: jest.fn(),
                  handlerState: jest.fn()
                } as any}
              >
                {children}
              </FormContactContext.Provider>
            </CityMapContext.Provider>
          </ModalContext.Provider>
        )
      }
    );

    act(() => {
      result.current.setActiveStep(1);
    });

    await act(async () => {
      await result.current.enrichedCtx.handleSubmit?.({ preventDefault: jest.fn() } as any);
    });

    expect(updateAssistedLeadMock).toHaveBeenCalled();
    expect(resetForm).toHaveBeenCalled();
  });

  it("handles update error on final step", async () => {
    storeState.semiautomaticFlow.leadId = "lead-1";
    updateAssistedLeadMock.mockRejectedValue(new Error("boom"));
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const setStatusType = jest.fn();

    const customWrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider value={{ state: false, handlerState, handlerModalType }}>
        <CityMapContext.Provider
          value={{
            selectedCity: "Quito",
            selectedAddress: null,
            setSelectedCity: jest.fn(),
            setSelectedAddress: jest.fn(),
            manualPinMode: false,
            setManualPinMode: jest.fn(),
            mapProvider: "mapbox",
            mapToken: "token",
            setMapConfig: jest.fn()
          }}
        >
          <FormContactContext.Provider
            value={{
              values: {},
              setFieldValue: jest.fn(),
              validateForm: jest.fn().mockResolvedValue({}),
              setTouched: jest.fn(),
              resetForm: jest.fn(),
              setStatusType,
              handlerState: jest.fn()
            } as any}
          >
            {children}
          </FormContactContext.Provider>
        </CityMapContext.Provider>
      </ModalContext.Provider>
    );

    const { result } = renderHook(
      () =>
        useSemiautomaticFlow(
          [{ stepType: "step.coverage" }, { stepType: "step.final-data" }] as any,
          false
        ),
      { wrapper: customWrapper }
    );

    act(() => {
      result.current.setActiveStep(1);
    });

    await act(async () => {
      await result.current.enrichedCtx.handleSubmit?.({ preventDefault: jest.fn() } as any);
    });

    expect(setStatusType).toHaveBeenCalledWith("error");
    expect(handlerModalType).toHaveBeenCalledWith(RenderModalType.CONTACT_FORM_STATUS);
    expect(handlerState).toHaveBeenCalledWith(true);
  });

  it("marks fields touched when validation fails on final step", async () => {
    storeState.semiautomaticFlow.leadId = "lead-1";
    const setTouched = jest.fn();

    const { result } = renderHook(
      () =>
        useSemiautomaticFlow(
          [{ stepType: "step.coverage" }, { stepType: "step.final-data" }] as any,
          false
        ),
      {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <ModalContext.Provider value={{ state: false, handlerState: jest.fn(), handlerModalType: jest.fn() }}>
            <CityMapContext.Provider
              value={{
                selectedCity: "Quito",
                selectedAddress: null,
                setSelectedCity: jest.fn(),
                setSelectedAddress: jest.fn(),
                manualPinMode: false,
                setManualPinMode: jest.fn(),
                mapProvider: "mapbox",
                mapToken: "token",
                setMapConfig: jest.fn()
              }}
            >
              <FormContactContext.Provider
                value={{
                  values: {},
                  setFieldValue: jest.fn(),
                  validateForm: jest.fn().mockResolvedValue({ phone: "err" }),
                  setTouched,
                  resetForm: jest.fn(),
                  setStatusType: jest.fn()
                } as any}
              >
                {children}
              </FormContactContext.Provider>
            </CityMapContext.Provider>
          </ModalContext.Provider>
        )
      }
    );

    act(() => {
      result.current.setActiveStep(1);
    });

    await act(async () => {
      await result.current.enrichedCtx.handleSubmit?.({ preventDefault: jest.fn() } as any);
    });

    expect(setTouched).toHaveBeenCalledWith({ phone: true });
    expect(updateAssistedLeadMock).not.toHaveBeenCalled();
  });

  it("uses direct lead submit when no leadId and sets duplicated status", async () => {
    sendAssistedLeadMock.mockResolvedValue({ success: false, isDuplicate: true });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const setStatusType = jest.fn();

    const { result } = renderHook(
      () =>
        useSemiautomaticFlow(
          [{ stepType: "step.coverage" }, { stepType: "step.final-data" }] as any,
          false
        ),
      {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <ModalContext.Provider value={{ state: false, handlerState, handlerModalType }}>
            <CityMapContext.Provider
              value={{
                selectedCity: "Quito",
                selectedAddress: null,
                setSelectedCity: jest.fn(),
                setSelectedAddress: jest.fn(),
                manualPinMode: false,
                setManualPinMode: jest.fn(),
                mapProvider: "mapbox",
                mapToken: "token",
                setMapConfig: jest.fn()
              }}
            >
              <FormContactContext.Provider
                value={{
                  values: { phone: "099", document: "123", email: "a@a.com" },
                  setFieldValue: jest.fn(),
                  validateForm: jest.fn().mockResolvedValue({}),
                  setTouched: jest.fn(),
                  resetForm: jest.fn(),
                  setStatusType
                } as any}
              >
                {children}
              </FormContactContext.Provider>
            </CityMapContext.Provider>
          </ModalContext.Provider>
        )
      }
    );

    act(() => {
      result.current.setActiveStep(1);
    });

    await act(async () => {
      await result.current.enrichedCtx.handleSubmit?.({ preventDefault: jest.fn() } as any);
    });

    expect(sendAssistedLeadMock).toHaveBeenCalled();
    expect(setStatusType).toHaveBeenCalledWith("duplicated");
    expect(handlerModalType).toHaveBeenCalledWith(RenderModalType.CONTACT_FORM_STATUS);
    expect(handlerState).toHaveBeenCalledWith(true);
  });

  it("clears flow state on successful direct lead creation", async () => {
    sendAssistedLeadMock.mockResolvedValue({ success: true, id: "lead-123" });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const resetForm = jest.fn();

    const { result } = renderHook(
      () =>
        useSemiautomaticFlow(
          [{ stepType: "step.coverage" }, { stepType: "step.final-data" }] as any,
          false
        ),
      {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <ModalContext.Provider value={{ state: false, handlerState, handlerModalType }}>
            <CityMapContext.Provider
              value={{
                selectedCity: "Quito",
                selectedAddress: null,
                setSelectedCity: jest.fn(),
                setSelectedAddress: jest.fn(),
                manualPinMode: false,
                setManualPinMode: jest.fn(),
                mapProvider: "mapbox",
                mapToken: "token",
                setMapConfig: jest.fn()
              }}
            >
              <FormContactContext.Provider
                value={{
                  values: { phone: "099", document: "123", email: "a@a.com" },
                  setFieldValue: jest.fn(),
                  validateForm: jest.fn().mockResolvedValue({}),
                  setTouched: jest.fn(),
                  resetForm,
                  setStatusType: jest.fn()
                } as any}
              >
                {children}
              </FormContactContext.Provider>
            </CityMapContext.Provider>
          </ModalContext.Provider>
        )
      }
    );

    act(() => {
      result.current.setActiveStep(1);
    });

    await act(async () => {
      await result.current.enrichedCtx.handleSubmit?.({ preventDefault: jest.fn() } as any);
    });

    expect(clearSelectedPlanMock).toHaveBeenCalled();
    expect(setCoverageCompletedMock).toHaveBeenCalledWith(false);
    expect(clearFlowStateMock).toHaveBeenCalled();
    expect(resetForm).toHaveBeenCalled();
  });

  it("redirects after modal closes on successful direct lead", async () => {
    sendAssistedLeadMock.mockResolvedValue({ success: true, id: "lead-123" });
    let modalState = true;
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();

    const modalWrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider value={{ state: modalState, handlerState, handlerModalType }}>
        <CityMapContext.Provider
          value={{
            selectedCity: "Quito",
            selectedAddress: null,
            setSelectedCity: jest.fn(),
            setSelectedAddress: jest.fn(),
            manualPinMode: false,
            setManualPinMode: jest.fn(),
            mapProvider: "mapbox",
            mapToken: "token",
            setMapConfig: jest.fn()
          }}
        >
          <FormContactContext.Provider
            value={{
              values: { phone: "099", document: "123", email: "a@a.com" },
              setFieldValue: jest.fn(),
              validateForm: jest.fn().mockResolvedValue({}),
              setTouched: jest.fn(),
              resetForm: jest.fn(),
              setStatusType: jest.fn()
            } as any}
          >
            {children}
          </FormContactContext.Provider>
        </CityMapContext.Provider>
      </ModalContext.Provider>
    );

    const { result, rerender } = renderHook(
      () =>
        useSemiautomaticFlow(
          [{ stepType: "step.coverage" }, { stepType: "step.final-data" }] as any,
          false
        ),
      { wrapper: modalWrapper }
    );

    act(() => {
      result.current.setActiveStep(1);
    });

    await act(async () => {
      await result.current.enrichedCtx.handleSubmit?.({ preventDefault: jest.fn() } as any);
    });

    modalState = false;
    rerender();
    expect(routerPushMock).toHaveBeenCalledWith("/");
  });

  it("marks touched when direct lead validation fails", async () => {
    const setTouched = jest.fn();

    const { result } = renderHook(
      () =>
        useSemiautomaticFlow(
          [{ stepType: "step.coverage" }, { stepType: "step.final-data" }] as any,
          false
        ),
      {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <ModalContext.Provider value={{ state: false, handlerState: jest.fn(), handlerModalType: jest.fn() }}>
            <CityMapContext.Provider
              value={{
                selectedCity: "Quito",
                selectedAddress: null,
                setSelectedCity: jest.fn(),
                setSelectedAddress: jest.fn(),
                manualPinMode: false,
                setManualPinMode: jest.fn(),
                mapProvider: "mapbox",
                mapToken: "token",
                setMapConfig: jest.fn()
              }}
            >
              <FormContactContext.Provider
                value={{
                  values: {},
                  setFieldValue: jest.fn(),
                  validateForm: jest.fn().mockResolvedValue({ document: "err" }),
                  setTouched,
                  resetForm: jest.fn(),
                  setStatusType: jest.fn()
                } as any}
              >
                {children}
              </FormContactContext.Provider>
            </CityMapContext.Provider>
          </ModalContext.Provider>
        )
      }
    );

    act(() => {
      result.current.setActiveStep(1);
    });

    await act(async () => {
      await result.current.enrichedCtx.handleSubmit?.({ preventDefault: jest.fn() } as any);
    });

    expect(setTouched).toHaveBeenCalledWith({ document: true });
    expect(sendAssistedLeadMock).not.toHaveBeenCalled();
  });

  it("locks document and phone fields when leadId exists on final step", () => {
    storeState.semiautomaticFlow.leadId = "lead-99";
    const { result } = renderHook(
      () =>
        useSemiautomaticFlow(
          [{ stepType: "step.coverage" }, { stepType: "step.final-data" }] as any,
          false
        ),
      { wrapper }
    );

    act(() => {
      result.current.setActiveStep(1);
    });

    expect(result.current.enrichedCtx.lockedFields).toEqual([
      FormContactInputType.PHONE,
      FormContactInputType.DOCUMENT,
      FormContactInputType.CEDULA
    ]);
  });
});
