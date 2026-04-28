import { renderHook, act, waitFor } from "@testing-library/react";
import { useContactForm } from "@hooks/providers/useContactForm";
import { ModalContext } from "@context/modal";
import { AssistedLeadErrorCode } from "@lib/constants/state";

const addEvent = jest.fn();
const sendAssistedLeadMock = jest.fn();
const dispatchLeadEmailMock = jest.fn();
const mockDispatch = jest.fn();
const mockRouterPush = jest.fn();
const mockWindowOpen = jest.fn();
const useMatchMediaMock = jest.fn(() => ({
  isDesktop: true
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockRouterPush })
}));

jest.mock("@store/semiautomaticFlow/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(() => null)
}));

jest.mock("@store/semiautomaticFlow", () => ({
  setLeadData: (data: unknown) => ({ type: "setLeadData", payload: data }),
  setSelectedPlan: (plan: unknown) => ({ type: "setSelectedPlan", payload: plan })
}));

jest.mock("@lib/api/leads/assisted", () => ({
  sendAssistedLead: (...args: unknown[]) => sendAssistedLeadMock(...args)
}));

jest.mock("@lib/api/leads/distribution", () => ({
  dispatchLeadEmail: (...args: unknown[]) => dispatchLeadEmailMock(...args)
}));

jest.mock("@tanstack/react-query", () => ({
  useMutation: (config: any) => ({
    mutateAsync: async (vars: unknown) => {
      try {
        const res = await config.mutationFn(vars);
        config.onSuccess?.(res);
        return res;
      } catch (error) {
        config.onError?.(error);
        throw error;
      }
    },
    isPending: false
  })
}));

jest.mock("@hooks/useCustomPathname", () => ({
  useCustomPathname: () => "home"
}));

jest.mock("@hooks/useGtm", () => ({
  useGtm: () => ({ addEvent })
}));

jest.mock("@lib/utils/utms", () => ({
  getUtmSource: () => ({ utm_source: "test" })
}));

jest.mock("@sitio-publico/shared-ui", () => ({
  useMatchMedia: () => useMatchMediaMock()
}));

const buildCedula = (province: number, third: number, rest: number[]) => {
  const digits = [Math.floor(province / 10), province % 10, third, ...rest];
  const coef = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    let val = digits[i] * coef[i];
    if (val >= 10) val -= 9;
    sum += val;
  }

  const check = (10 - (sum % 10)) % 10;
  return `${digits.join("")}${check}`;
};

describe("useContactForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sendAssistedLeadMock.mockReset();
    dispatchLeadEmailMock.mockReset();
    addEvent.mockReset();
    mockDispatch.mockReset();
    mockRouterPush.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => {});
    useMatchMediaMock.mockReturnValue({ isDesktop: true });
    mockWindowOpen.mockReset();
    jest.spyOn(window, "open").mockImplementation(mockWindowOpen as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("sets statusType success and opens modal on submit", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce({
      success: true,
      isDuplicate: false
    });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.handlerData({
        privacyCheckbox: {
          label: "Acepto",
          name: "privacy_policy",
          required: true
        }
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(handlerState).toHaveBeenCalledWith(true);
    expect(result.current.statusType).toBe("success");
    expect(result.current.values.privacy_policy).toBe(false);
  });

  it("redirects to button href on success instead of opening status modal", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce({
      success: true,
      isDuplicate: false
    });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.handlerData({
        button: { href: "/checkout", isExternalHref: false },
        privacyCheckbox: {
          label: "Acepto",
          name: "privacy_policy",
          required: true
        }
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(mockRouterPush).toHaveBeenCalledWith("/checkout");
    expect(handlerState).toHaveBeenCalledWith(false);
    expect(handlerState).not.toHaveBeenCalledWith(true);
  });

  it("opens button href in new tab when isExternalHref is true", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce({
      success: true,
      isDuplicate: false
    });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.handlerData({
        button: { href: "https://xtrim.ec", isExternalHref: true },
        privacyCheckbox: {
          label: "Acepto",
          name: "privacy_policy",
          required: true
        }
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(mockWindowOpen).toHaveBeenCalledWith(
      "https://xtrim.ec",
      "_blank",
      "noopener,noreferrer"
    );
    expect(mockRouterPush).not.toHaveBeenCalled();
    expect(handlerState).not.toHaveBeenCalledWith(true);
  });

  it("sets statusType error when submit returns null response", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce(null);
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(handlerState).toHaveBeenCalledWith(true);
    expect(result.current.statusType).toBe("error");
  });

  it("sets statusType duplicated when api returns duplicate error code", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce({
      success: false,
      isDuplicate: true,
      errorCode: AssistedLeadErrorCode.DUPLICATE
    });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(handlerState).toHaveBeenCalledWith(true);
    expect(result.current.statusType).toBe("duplicated");
  });

  it("sets statusType error when api returns non-duplicate error", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce({
      success: false,
      isDuplicate: false,
      errorCode: AssistedLeadErrorCode.ERROR
    });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(handlerState).toHaveBeenCalledWith(true);
    expect(result.current.statusType).toBe("error");
  });

  it("tracks gtm event with plan data when response contains id", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce({
      success: true,
      isDuplicate: false,
      id: "lead-id",
      phone: "0999999999"
    });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.setSection?.("custom-section");
      result.current.setPlan?.({
        id: "plan-1",
        name: "Plan 1",
        speedUnit: "Mbps",
        priceInfo: { amount: "$10" }
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(addEvent).toHaveBeenCalled();
  });

  it("sets statusType error and opens modal on mutation error", async () => {
    sendAssistedLeadMock.mockRejectedValueOnce(new Error("boom"));
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(handlerState).toHaveBeenCalledWith(true);
    expect(result.current.statusType).toBe("error");
  });

  it("requires privacy policy when configured", async () => {
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.handlerData({
        privacyCheckbox: {
          label: "Acepto",
          name: "privacy_policy",
          required: true
        }
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", false);
    });

    let errors: any;
    await act(async () => {
      errors = await result.current.validateForm();
    });
    expect(errors.privacy_policy).toBe("Debes aceptar para continuar");
  });

  it("validates dynamic privacy checkbox name from cms", async () => {
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.handlerData({
        privacyCheckbox: {
          label: "Acepto",
          name: "terms_data",
          required: true
        }
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("terms_data", false);
    });

    let errors: any;
    await act(async () => {
      errors = await result.current.validateForm();
    });

    expect(errors.terms_data).toBe("Debes aceptar para continuar");
  });

  it("revalidates isValid when privacy field name changes after prefilled values", async () => {
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);
    const scopedPrivacy = "privacy_policy__lead_doc_1";

    act(() => {
      result.current.handlerData({
        privacyCheckbox: {
          label: "Acepto",
          name: "privacy_policy",
          required: true
        }
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", false);
    });

    await waitFor(() => {
      expect(result.current.isValid).toBe(false);
    });

    await act(async () => {
      await result.current.setFieldValue(scopedPrivacy, true);
    });

    act(() => {
      result.current.handlerData({
        privacyCheckbox: {
          label: "Acepto",
          name: scopedPrivacy,
          required: true
        }
      } as any);
    });

    await waitFor(() => {
      expect(result.current.isValid).toBe(true);
    });
  });

  it("uses email flow when distributionMode is email", async () => {
    dispatchLeadEmailMock.mockResolvedValueOnce({ success: true });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.setLeadSelection?.({
        distributionMode: "email",
        leadFormDocumentId: "lead-doc-1",
        routingConfigDocumentId: "routing-doc-1"
      } as any);
    });
    expect(result.current.leadSelection?.distributionMode).toBe("email");

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(dispatchLeadEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        leadFormDocumentId: "lead-doc-1",
        routingConfigDocumentId: "routing-doc-1",
        pageSlug: "home"
      })
    );
    expect(sendAssistedLeadMock).not.toHaveBeenCalled();
    expect(result.current.statusType).toBe("success");
  });

  it("uses both flow and sets error when one integration fails", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce({ success: true });
    dispatchLeadEmailMock.mockRejectedValueOnce(new Error("mail down"));
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.setLeadSelection?.({
        distributionMode: "both",
        leadFormDocumentId: "lead-doc-2",
        routingConfigDocumentId: "routing-doc-2",
        channel: "Sitio web"
      } as any);
    });
    expect(result.current.leadSelection?.distributionMode).toBe("both");

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(sendAssistedLeadMock).toHaveBeenCalled();
    expect(dispatchLeadEmailMock).toHaveBeenCalled();
    expect(result.current.statusType).toBe("error");
  });

  it("handles thrown error from dispatchLeadEmail in email mode", async () => {
    dispatchLeadEmailMock.mockRejectedValueOnce(new Error("email-fail"));
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.setLeadSelection?.({
        distributionMode: "email",
        leadFormDocumentId: "lead-doc-err",
        routingConfigDocumentId: "routing-doc-err"
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(handlerState).toHaveBeenCalledWith(true);
    expect(result.current.statusType).toBe("error");
  });

  it("builds leadData from configured inputs and skips combobox fields", async () => {
    dispatchLeadEmailMock.mockResolvedValueOnce({ success: true });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.handlerData({
        inputs: [
          { name: "cedula", type: "idCard", required: true },
          { name: "name", type: "text", required: false },
          { name: "city", type: "combobox", required: true }
        ]
      } as any);
      result.current.setLeadSelection?.({
        distributionMode: "email",
        leadFormDocumentId: "lead-doc-inputs",
        routingConfigDocumentId: "routing-doc-inputs"
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("name", "Alexis");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(dispatchLeadEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        leadData: expect.objectContaining({
          cedula: cedula,
          name: "Alexis"
        })
      })
    );
    expect(dispatchLeadEmailMock.mock.calls[0][0].leadData).toEqual(
      expect.objectContaining({
        city: ""
      })
    );
  });

  it("keeps success status in both mode when TOM and email succeed", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce({
      success: true,
      id: "lead-both-ok",
      phone: "0999999999"
    });
    dispatchLeadEmailMock.mockResolvedValueOnce({ success: true });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.setLeadSelection?.({
        distributionMode: "both",
        leadFormDocumentId: "lead-doc-both-ok",
        routingConfigDocumentId: "routing-doc-both-ok",
        channel: "Sitio web"
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(result.current.statusType).toBe("success");
  });

  it("opens error status when lead_form exists but distributionMode is missing", async () => {
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.setLeadSelection?.({
        leadFormDocumentId: "lead-doc-no-mode",
        routingConfigDocumentId: "routing-doc-no-mode"
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(sendAssistedLeadMock).not.toHaveBeenCalled();
    expect(dispatchLeadEmailMock).not.toHaveBeenCalled();
    expect(handlerState).toHaveBeenCalledWith(true);
    expect(result.current.statusType).toBe("error");
  });

  it("uses section from context when modal state is true and tracks mobile banner section", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce({
      success: true,
      isDuplicate: false,
      id: "lead-mobile",
      phone: "0999999999"
    });
    useMatchMediaMock.mockReturnValue({ isDesktop: false });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: true, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.setSection?.("custom-mobile-section");
      result.current.setPlan?.({} as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(addEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        section: "custom-mobile-section"
      })
    );
  });

  it("uses documentoSchema fallback for unknown required input types", async () => {
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });

    act(() => {
      result.current.handlerData({
        inputs: [{ name: "customDoc", type: "unknown", required: true }]
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("customDoc", "bad");
    });

    let errors: any;
    await act(async () => {
      errors = await result.current.validateForm();
    });

    expect(errors.customDoc).toBeDefined();
  });

  it("sends TOM payload with empty doc/phone when current form has no doc/phone inputs", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce({
      success: true,
      isDuplicate: false
    });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });

    act(() => {
      result.current.handlerData({
        inputs: [{ name: "email", type: "email", required: true }]
      } as any);
      result.current.setLeadSelection?.({
        channel: "Sitio web"
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("email", "alexis@test.com");
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(sendAssistedLeadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: expect.objectContaining({
          phone: "",
          document_number: ""
        })
      })
    );
  });

  it("shows error status when email dispatch returns unsuccessful response", async () => {
    dispatchLeadEmailMock.mockResolvedValueOnce({ success: false });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.setLeadSelection?.({
        distributionMode: "email",
        leadFormDocumentId: "lead-doc-fail",
        routingConfigDocumentId: "routing-doc-fail"
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(result.current.statusType).toBe("error");
  });

  it("requires privacy policy in dynamic-input schema path", async () => {
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    act(() => {
      result.current.handlerData({
        inputs: [{ name: "full_name", type: "text", required: true }],
        privacyCheckbox: {
          label: "Acepto",
          name: "privacy_policy",
          required: true
        }
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("full_name", "Alexis");
      await result.current.setFieldValue("privacy_policy", false);
    });

    let errors: any;
    await act(async () => {
      errors = await result.current.validateForm();
    });

    expect(errors.privacy_policy).toBe("Debes aceptar para continuar");
  });

  it("builds email leadData skipping nameless inputs and normalizing null values", async () => {
    dispatchLeadEmailMock.mockResolvedValueOnce({ success: true });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.handlerData({
        inputs: [
          { type: "text", required: false },
          { name: "cedula", type: "idCard", required: true }
        ]
      } as any);
      result.current.setLeadSelection?.({
        distributionMode: "email",
        leadFormDocumentId: "lead-data-doc",
        routingConfigDocumentId: "lead-data-routing"
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("extra_nullable", null);
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(dispatchLeadEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        leadData: expect.objectContaining({
          cedula
        })
      })
    );
    expect(
      Object.keys(dispatchLeadEmailMock.mock.calls[0][0].leadData)
    ).not.toContain("undefined");
  });

  it("uses documentoSchema fallback when required input type is undefined", async () => {
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });

    act(() => {
      result.current.handlerData({
        inputs: [{ name: "customDoc", required: true }]
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("customDoc", "123");
    });

    const errors = await result.current.validateForm();
    expect(errors.customDoc).toBeDefined();
  });

  it("normalizes null values in fallback leadData path (no configured inputs)", async () => {
    dispatchLeadEmailMock.mockResolvedValueOnce({ success: true });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.handlerData({
        inputs: []
      } as any);
      result.current.setLeadSelection?.({
        distributionMode: "email",
        leadFormDocumentId: "lead-fallback",
        routingConfigDocumentId: "routing-fallback"
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("extra_nullable", null);
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(dispatchLeadEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        leadData: expect.objectContaining({
          extra_nullable: ""
        })
      })
    );
  });

  it("sends RUC document type when document has 13 digits", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce({ success: true });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);
    const ruc = `${cedula}001`;

    await act(async () => {
      await result.current.setFieldValue("document", ruc);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    const payload = sendAssistedLeadMock.mock.calls[0][0];
    expect(payload.customer.document_type).toBe("ruc");
    expect(payload.customer.document_number).toBe(ruc);
  });

  it("includes location.city in TOM payload when provided in form values", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce({ success: true });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("city", "LOJA");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(sendAssistedLeadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        location: expect.objectContaining({
          city: "LOJA",
          has_location: false
        })
      })
    );
  });

  it("sends products from product_name field when form provides combobox value", async () => {
    sendAssistedLeadMock.mockResolvedValueOnce({ success: true });
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
      await result.current.setFieldValue("product_name", "Plan 1000 GB Internet");
      await result.current.setFieldValue("privacy_policy", true);
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(sendAssistedLeadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        products: [{ product_name: "Plan 1000 GB Internet" }]
      })
    );
  });


  it("requires dynamic privacy checkbox when value is undefined", async () => {
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useContactForm(), { wrapper });
    const cedula = buildCedula(17, 1, [0, 0, 0, 0, 0, 0]);

    act(() => {
      result.current.handlerData({
        privacyCheckbox: {
          label: "Acepto",
          name: "privacy_policy__lead_doc_1",
          required: true
        }
      } as any);
    });

    await act(async () => {
      await result.current.setFieldValue("document", cedula);
      await result.current.setFieldValue("phone", "0999999999");
    });

    let errors: any;
    await act(async () => {
      errors = await result.current.validateForm();
    });

    expect(errors.privacy_policy__lead_doc_1).toBe("Debes aceptar para continuar");
  });
});
