import { renderHook, act, waitFor } from "@testing-library/react";
import { useSemiautomaticFlow } from "@hooks/useSemiautomaticFlow";
import type { TFlowStepType } from "@interfaces/lib/semiautomaticFlow";

type TStepInfo = { stepType?: TFlowStepType };

const mockRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockRouterPush }),
  usePathname: () => "/checkout"
}));

const mockCheckCoverageByCoords = jest.fn();
jest.mock("@lib/api/leads/coverage", () => ({
  checkCoverageByCoords: (...args: any[]) => mockCheckCoverageByCoords(...args)
}));

const mockSendAssistedLead = jest.fn();
const mockUpdateAssistedLead = jest.fn();
jest.mock("@lib/api/leads/assisted", () => ({
  sendAssistedLead: (...args: any[]) => mockSendAssistedLead(...args),
  updateAssistedLead: (...args: any[]) => mockUpdateAssistedLead(...args),
}));

jest.mock("@lib/constants/constants", () => ({
  NO_COVERAGE_REDIRECT: "/no-cobertura",
  DEFAULT_GTM_EVENT: {
    event: "",
    flow: "",
    section: "",
    elementDescription: "",
    em: "",
    ph: "",
    fn: "",
    ln: "",
    ct: "",
    country: "",
    idTransaction: "",
  },
}));

jest.mock("@lib/utils/utms", () => ({
  getUtmSource: () => ({ utm_source: "test", utm_campaign: undefined, utm_medium: undefined, referrer: "" }),
}));


const _modal = {
  handlerState: jest.fn(),
  handlerModalType: jest.fn(),
};
const _form = {
  setStatusType: jest.fn(),
  setFieldValue: jest.fn(),
  validateForm: jest.fn().mockResolvedValue({}),
  setTouched: jest.fn(),
  values: { document: "1234567890", phone: "0987654321", email: "test@example.com", privacy_policy: true },
  leadSelection: { channel: "web" },
  loading: false,
};

jest.mock("@context/modal", () => {
  const React = require("react");
  return {
    ModalContext: React.createContext({
      handlerState: (...a: any[]) => _modal.handlerState(...a),
      handlerModalType: (...a: any[]) => _modal.handlerModalType(...a),
    }),
  };
});

jest.mock("@context/formContact", () => {
  const React = require("react");
  return {
    FormContactContext: React.createContext({
      get loading() { return _form.loading; },
      get values() { return _form.values; },
      get leadSelection() { return _form.leadSelection; },
      setStatusType: (...a: any[]) => _form.setStatusType(...a),
      setFieldValue: (...a: any[]) => _form.setFieldValue(...a),
      validateForm: (...a: any[]) => _form.validateForm(...a),
      setTouched: (...a: any[]) => _form.setTouched(...a),
    }),
  };
});


let mockLeadId: string | null = null;
let mockPhone: string | null = null;
let mockDocumentNumber: string | null = null;
let mockSelectedPlan: any = null;

jest.mock("@store/semiautomaticFlow/hooks", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (selector: any) =>
    selector({
      semiautomaticFlow: {
        leadId: mockLeadId,
        phone: mockPhone,
        documentNumber: mockDocumentNumber,
        selectedPlan: mockSelectedPlan,
      }
    })
}));

jest.mock("@store/semiautomaticFlow", () => ({
  setSelectedPlan: jest.fn((p: any) => ({ type: "setSelectedPlan", payload: p })),
  clearSelectedPlan: jest.fn(() => ({ type: "clearSelectedPlan" })),
  setCoverageCompleted: jest.fn((v: boolean) => ({ type: "setCoverageCompleted", payload: v })),
  setLeadData: jest.fn((p: any) => ({ type: "setLeadData", payload: p })),
  clearLeadData: jest.fn(() => ({ type: "clearLeadData" })),
  clearFlowState: jest.fn(),
}));


const mockAddress = { latitude: -0.22, longitude: -78.5, label: "Av. Test 123" };

const normalSteps: TStepInfo[] = [
  { stepType: "step.coverage" },
  { stepType: "step.plans" },
  { stepType: "step.final-data" }
];

const planModeSteps: TStepInfo[] = [
  { stepType: "step.plans" },
  { stepType: "step.coverage" },
  { stepType: "step.final-data" }
];

describe("useSemiautomaticFlow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockLeadId = null;
    mockPhone = null;
    mockDocumentNumber = null;
    mockSelectedPlan = null;
    _form.setFieldValue.mockReset();
    _form.validateForm.mockResolvedValue({});
    _form.values = { document: "1234567890", phone: "0987654321", email: "test@example.com", privacy_policy: true };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("initializes with activeStep 0 and coverageLoading false (normal mode)", () => {
    const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
    expect(result.current.activeStep).toBe(0);
    expect(result.current.enrichedCtx.loading).toBe(false);
  });

  it("initializes at coverage step when isPlanMode=true", () => {
    const { result } = renderHook(() => useSemiautomaticFlow(planModeSteps, true));
    expect(result.current.activeStep).toBe(1);
  });

  it("onAddressChange updates the internal address ref", async () => {
    const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));

    mockCheckCoverageByCoords.mockResolvedValueOnce({ hasCoverage: true });

    act(() => { result.current.onAddressChange(mockAddress); });

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction({} as any);
    });

    expect(mockCheckCoverageByCoords).toHaveBeenCalledWith(
      mockAddress.latitude,
      mockAddress.longitude,
      mockAddress.label
    );
  });

  it("does not call coverage API when no address is set", async () => {
    const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction({} as any);
    });

    expect(mockCheckCoverageByCoords).not.toHaveBeenCalled();
    expect(result.current.activeStep).toBe(0);
  });

  it("advances activeStep when coverage is found", async () => {
    mockCheckCoverageByCoords.mockResolvedValueOnce({ hasCoverage: true });

    const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
    act(() => { result.current.onAddressChange(mockAddress); });

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction({} as any);
    });

    expect(result.current.activeStep).toBe(1);
  });

  it("advances from coverage step (index 1) in plan mode", async () => {
    mockCheckCoverageByCoords.mockResolvedValueOnce({ hasCoverage: true });

    const { result } = renderHook(() => useSemiautomaticFlow(planModeSteps, true));
    act(() => { result.current.onAddressChange(mockAddress); });

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction({} as any);
    });

    expect(mockCheckCoverageByCoords).toHaveBeenCalled();
    expect(result.current.activeStep).toBe(2);
  });

  it("does not exceed totalSteps - 1 when already at last step", async () => {
    mockCheckCoverageByCoords.mockResolvedValue({ hasCoverage: true });

    const steps: TStepInfo[] = [{ stepType: "step.coverage" }, { stepType: "step.final-data" }];
    const { result } = renderHook(() => useSemiautomaticFlow(steps, false));
    act(() => { result.current.onAddressChange(mockAddress); });

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction({} as any);
    });
    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction({} as any);
    });

    expect(result.current.activeStep).toBe(1);
  });

  it("shows coverage error state when no coverage", async () => {
    mockCheckCoverageByCoords.mockResolvedValueOnce({ hasCoverage: false });

    const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
    act(() => { result.current.onAddressChange(mockAddress); });

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction({} as any);
    });

    expect(mockRouterPush).not.toHaveBeenCalled();
    expect(result.current.activeStep).toBe(0);
    expect(result.current.coverageApiError).toBe(true);
  });

  it("hydrates phone and document when coverage error appears and lead data exists", async () => {
    mockLeadId = "lead-1";
    mockPhone = "0999999999";
    mockDocumentNumber = "1712345678";
    mockCheckCoverageByCoords.mockResolvedValueOnce({ hasCoverage: false });

    const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
    act(() => { result.current.onAddressChange(mockAddress); });

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction({ city: "Quito" } as any);
    });

    expect(result.current.coverageApiError).toBe(true);
    await waitFor(() => {
      expect(_form.setFieldValue).toHaveBeenCalledWith("phone", "0999999999");
      expect(_form.setFieldValue).toHaveBeenCalledWith("document", "1712345678");
      expect(_form.setFieldValue).toHaveBeenCalledWith("cedula", "1712345678");
    });
  });

  it("sets coverageLoading to true during check and false after", async () => {
    let resolveCheck: (v: any) => void;
    mockCheckCoverageByCoords.mockReturnValueOnce(
      new Promise((r) => { resolveCheck = r; })
    );

    const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
    act(() => { result.current.onAddressChange(mockAddress); });

    act(() => { result.current.enrichedCtx.onSimpleAction({} as any); });

    await waitFor(() => expect(result.current.enrichedCtx.loading).toBe(true));

    await act(async () => { resolveCheck!({ hasCoverage: true }); });

    await waitFor(() => expect(result.current.enrichedCtx.loading).toBe(false));
  });

  it("resets coverageLoading to false when coverage check throws", async () => {
    mockCheckCoverageByCoords.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
    act(() => { result.current.onAddressChange(mockAddress); });

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction({} as any);
    });

    expect(result.current.enrichedCtx.loading).toBe(false);
    expect(result.current.activeStep).toBe(0);
    expect(result.current.coverageApiError).toBe(true);
  });

  it("stays in coverage error state after failed coverage — no retry via onSimpleAction", async () => {
    mockCheckCoverageByCoords.mockRejectedValueOnce(new Error("Network error"));
    mockSendAssistedLead.mockResolvedValueOnce({ success: true, isDuplicate: false });

    const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
    act(() => { result.current.onAddressChange(mockAddress); });

    // Primera llamada: falla cobertura → coverageApiError=true
    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction({} as any);
    });
    expect(result.current.coverageApiError).toBe(true);

    // Segunda llamada: en flujo de error va a handleDirectLeadCreate (no reintenta cobertura)
    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction({
        document: "1234567890",
        phone: "0987654321",
      } as any);
    });

    // La API de cobertura solo se llamó una vez (sin reintento)
    expect(mockCheckCoverageByCoords).toHaveBeenCalledTimes(1);
    // Se llamó al flujo de creación directa de lead en su lugar
    expect(mockSendAssistedLead).toHaveBeenCalledTimes(1);
    // El error de cobertura permanece activo
    expect(result.current.coverageApiError).toBe(true);
  });

  it("enrichedCtx.loading is true while handleDirectLeadCreate is in progress (coverage error flow)", async () => {
    mockCheckCoverageByCoords.mockRejectedValueOnce(new Error("Network error"));

    let resolveLead: (v: any) => void;
    mockSendAssistedLead.mockReturnValueOnce(
      new Promise((r) => { resolveLead = r; })
    );

    const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
    act(() => { result.current.onAddressChange(mockAddress); });

    // Primera llamada: falla cobertura → coverageApiError=true
    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction({} as any);
    });
    expect(result.current.coverageApiError).toBe(true);

    // Segunda llamada: en flujo de error llama a handleDirectLeadCreate (pendiente)
    act(() => {
      result.current.enrichedCtx.onSimpleAction({
        document: "1234567890",
        phone: "0987654321",
      } as any);
    });

    // loading sube mientras sendAssistedLead está pendiente
    await waitFor(() => expect(result.current.enrichedCtx.loading).toBe(true));
    // coverageApiError permanece true durante la operación
    expect(result.current.coverageApiError).toBe(true);

    // Resolvemos la creación del lead
    await act(async () => {
      resolveLead!({ success: true, isDuplicate: false });
    });

    // loading vuelve a false
    await waitFor(() => expect(result.current.enrichedCtx.loading).toBe(false));
  });

  it("setActiveStep allows external step change", () => {
    const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));

    act(() => { result.current.setActiveStep(2); });

    expect(result.current.activeStep).toBe(2);
  });

  it("enrichedCtx.loading combines coverageLoading and formContactCtx.loading", async () => {
    const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
    expect(result.current.enrichedCtx.loading).toBe(false);
  });

  it("onSimpleAction uses handleFinalStepUpdate when not on coverage step", async () => {
    const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
    act(() => { result.current.setActiveStep(2); });

    await act(async () => {
      await result.current.enrichedCtx.onSimpleAction({} as any);
    });

    expect(mockCheckCoverageByCoords).not.toHaveBeenCalled();
  });


  describe("flujo directo — sin leadId", () => {
    beforeEach(() => {
      mockLeadId = null;
      mockSelectedPlan = {
        id: "plan-123",
        name: "Plan 200Mbps",
        priceInfo: { amount: "$29.99" },
      };
    });

    it("onSimpleAction en paso final llama sendAssistedLead, NO updateAssistedLead", async () => {
      mockSendAssistedLead.mockResolvedValueOnce({ success: true, isDuplicate: false });

      const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
      act(() => { result.current.onAddressChange(mockAddress); });
      act(() => { result.current.setActiveStep(2); });

      await act(async () => {
        await result.current.enrichedCtx.onSimpleAction({
          document: "1234567890",
          phone: "0987654321",
          email: "user@example.com",
          privacy_policy: true,
        } as any);
      });

      expect(mockSendAssistedLead).toHaveBeenCalledTimes(1);
      expect(mockUpdateAssistedLead).not.toHaveBeenCalled();
    });

    it("payload de sendAssistedLead incluye location con coordenadas de cobertura", async () => {
      mockSendAssistedLead.mockResolvedValueOnce({ success: true, isDuplicate: false });

      const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
      act(() => { result.current.onAddressChange(mockAddress); });
      act(() => { result.current.setActiveStep(2); });

      await act(async () => {
        await result.current.enrichedCtx.onSimpleAction({
          document: "1234567890",
          phone: "0987654321",
          privacy_policy: true,
        } as any);
      });

      const payload = mockSendAssistedLead.mock.calls[0][0];
      expect(payload.location).toMatchObject({
        has_location: true,
        lat: -0.22,
        lng: -78.5,
        raw_address: "Av. Test 123",
      });
    });

    it("payload de sendAssistedLead incluye products con el plan seleccionado", async () => {
      mockSendAssistedLead.mockResolvedValueOnce({ success: true, isDuplicate: false });

      const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
      act(() => { result.current.onAddressChange(mockAddress); });
      act(() => { result.current.setActiveStep(2); });

      await act(async () => {
        await result.current.enrichedCtx.onSimpleAction({ document: "123", phone: "09" } as any);
      });

      const payload = mockSendAssistedLead.mock.calls[0][0];
      expect(payload.products).toHaveLength(1);
      expect(payload.products[0]).toMatchObject({
        product_name: "Plan 200Mbps",
        product_code: "plan-123",
        product_price: 29.99,
      });
    });

    it("payload de sendAssistedLead incluye customer con document y phone del formulario", async () => {
      mockSendAssistedLead.mockResolvedValueOnce({ success: true, isDuplicate: false });

      const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
      act(() => { result.current.setActiveStep(2); });

      await act(async () => {
        await result.current.enrichedCtx.onSimpleAction({
          document: "0987654321",
          phone: "0991234567",
        } as any);
      });

      const payload = mockSendAssistedLead.mock.calls[0][0];
      expect(payload.customer).toMatchObject({
        document_number: "0987654321",
        phone: "0991234567",
        document_type: "cedula",
      });
    });

    it("detecta document_type ruc cuando el campo ruc está presente", async () => {
      mockSendAssistedLead.mockResolvedValueOnce({ success: true, isDuplicate: false });

      const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
      act(() => { result.current.setActiveStep(2); });

      await act(async () => {
        await result.current.enrichedCtx.onSimpleAction({
          ruc: "1234567890001",
          phone: "0991234567",
        } as any);
      });

      const payload = mockSendAssistedLead.mock.calls[0][0];
      expect(payload.customer?.document_type).toBe("ruc");
    });

    it("lockedFields está vacío en flujo directo (usuario rellena todo)", () => {
      const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
      act(() => { result.current.setActiveStep(2); });
      expect(result.current.enrichedCtx.lockedFields).toEqual([]);
    });

    it("setStatusType recibe 'duplicated' cuando sendAssistedLead retorna isDuplicate=true", async () => {
      mockSendAssistedLead.mockResolvedValueOnce({ success: false, isDuplicate: true });

      const { result } = renderHook(() => useSemiautomaticFlow(normalSteps, false));
      act(() => { result.current.setActiveStep(2); });

      await act(async () => {
        await result.current.enrichedCtx.onSimpleAction({ document: "123", phone: "09" } as any);
      });

      expect(_form.setStatusType).toHaveBeenCalledWith("duplicated");
    });
  });
});
