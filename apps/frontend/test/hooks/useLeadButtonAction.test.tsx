import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useLeadButtonAction } from "@hooks/useLeadButtonAction";
import { ModalContext } from "@context/modal";
import { FormContactContext } from "@context/formContact";
import { RenderModalType } from "@lib/constants/state";

const getLeadFormSelectionByDocumentId = jest.fn();

jest.mock("@lib/api/web/leadDistribution", () => ({
  getLeadFormSelectionByDocumentId: (...args: unknown[]) =>
    getLeadFormSelectionByDocumentId(...args),
}));

const buildWrapper = () => {
  const handlerState = jest.fn();
  const handlerModalType = jest.fn();
  const setSection = jest.fn();
  const handlerData = jest.fn();
  const setLeadSelection = jest.fn();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ModalContext.Provider value={{ state: false, handlerState, handlerModalType }}>
      <FormContactContext.Provider
        value={{ setSection, handlerData, setLeadSelection }}
      >
        {children}
      </FormContactContext.Provider>
    </ModalContext.Provider>
  );

  return {
    wrapper,
    handlerState,
    handlerModalType,
    setSection,
    handlerData,
    setLeadSelection,
  };
};

describe("useLeadButtonAction", () => {
  beforeEach(() => {
    getLeadFormSelectionByDocumentId.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("runs whatsapp callback for identifier 1", async () => {
    const { wrapper, handlerState } = buildWrapper();
    const onWhatsapp = jest.fn();

    const { result } = renderHook(() => useLeadButtonAction(), { wrapper });

    await act(async () => {
      await result.current.runLeadButtonAction({
        button: { identifier: 1 },
        section: "s",
        onWhatsapp,
      });
    });

    expect(onWhatsapp).toHaveBeenCalled();
    expect(handlerState).not.toHaveBeenCalled();
  });

  it("opens modal when modal button has complete form", async () => {
    const {
      wrapper,
      handlerState,
      handlerModalType,
      setSection,
      handlerData,
      setLeadSelection,
    } = buildWrapper();
    const onModal = jest.fn();

    const selection = {
      leadFormDocumentId: "lf_1",
      channel: "Sitio web",
      distributionMode: "both",
      routingConfigDocumentId: "routing-1",
      form: {
        title: "Form",
        description: "Desc",
        inputs: [{ name: "phone", type: "text", label: "", placeholder: "" }],
      },
    } as any;

    const { result } = renderHook(() => useLeadButtonAction(), { wrapper });

    await act(async () => {
      await result.current.runLeadButtonAction({
        button: { identifier: 0, leadFormSelection: selection },
        section: "reviews",
        onModal,
      });
    });

    expect(handlerData).toHaveBeenCalledWith(selection.form);
    expect(setLeadSelection).toHaveBeenCalledWith(selection);
    expect(setSection).toHaveBeenCalledWith("reviews");
    expect(handlerModalType).toHaveBeenCalledWith(RenderModalType.CONTACT_FORM);
    expect(handlerState).toHaveBeenCalledWith(true);
    expect(onModal).toHaveBeenCalled();
    expect(getLeadFormSelectionByDocumentId).not.toHaveBeenCalled();
  });

  it("hydrates incomplete form by documentId before opening modal", async () => {
    const { wrapper, handlerData } = buildWrapper();
    const hydrated = {
      leadFormDocumentId: "lf_2",
      form: {
        title: "Hydrated",
        description: "Hydrated",
        inputs: [{ name: "email", type: "email", label: "", placeholder: "" }],
      },
    } as any;
    getLeadFormSelectionByDocumentId.mockResolvedValueOnce(hydrated);

    const { result } = renderHook(() => useLeadButtonAction(), { wrapper });

    await act(async () => {
      await result.current.runLeadButtonAction({
        button: {
          identifier: 0,
          leadFormSelection: {
            leadFormDocumentId: "lf_2",
            form: { title: "Partial", description: "Partial", inputs: [] },
          } as any,
        },
        section: "plan",
      });
    });

    expect(getLeadFormSelectionByDocumentId).toHaveBeenCalledWith("lf_2");
    expect(handlerData).toHaveBeenCalledWith(hydrated.form);
  });

  it("preserves original channel when hydrated selection has no channel", async () => {
    const { wrapper, setLeadSelection } = buildWrapper();
    getLeadFormSelectionByDocumentId.mockResolvedValueOnce({
      leadFormDocumentId: "lf_4",
      form: {
        title: "Hydrated",
        description: "Hydrated",
        inputs: [{ name: "email", type: "email", label: "", placeholder: "" }],
      },
    });

    const { result } = renderHook(() => useLeadButtonAction(), { wrapper });
    await act(async () => {
      await result.current.runLeadButtonAction({
        button: {
          identifier: 0,
          leadFormSelection: {
            leadFormDocumentId: "lf_4",
            channel: "Canal desde CMS",
            form: { title: "Partial", description: "Partial", inputs: [] },
          } as any,
        },
        section: "plan",
      });
    });

    expect(setLeadSelection).toHaveBeenCalledWith(
      expect.objectContaining({
        leadFormDocumentId: "lf_4",
        channel: "Canal desde CMS",
      })
    );
  });

  it("runs simple callback for non-modal/non-whatsapp identifier", async () => {
    const { wrapper } = buildWrapper();
    const onSimple = jest.fn();
    const { result } = renderHook(() => useLeadButtonAction(), { wrapper });

    await act(async () => {
      await result.current.runLeadButtonAction({
        button: { identifier: 2 },
        section: "simple",
        onSimple
      });
    });

    expect(onSimple).toHaveBeenCalled();
  });

  it("runs onSemiautomaticFlow callback for identifier 3", async () => {
    const { wrapper, handlerState } = buildWrapper();
    const onSemiautomaticFlow = jest.fn();

    const { result } = renderHook(() => useLeadButtonAction(), { wrapper });

    await act(async () => {
      await result.current.runLeadButtonAction({
        button: { identifier: 3 },
        section: "plan",
        onSemiautomaticFlow
      });
    });

    expect(onSemiautomaticFlow).toHaveBeenCalled();
    expect(handlerState).not.toHaveBeenCalled();
  });

  it("does not call onSimple when identifier is 3", async () => {
    const { wrapper } = buildWrapper();
    const onSimple = jest.fn();
    const onSemiautomaticFlow = jest.fn();

    const { result } = renderHook(() => useLeadButtonAction(), { wrapper });

    await act(async () => {
      await result.current.runLeadButtonAction({
        button: { identifier: 3 },
        section: "plan",
        onSimple,
        onSemiautomaticFlow
      });
    });

    expect(onSemiautomaticFlow).toHaveBeenCalled();
    expect(onSimple).not.toHaveBeenCalled();
  });

  it("does not open modal when hydrated form still has no renderable inputs", async () => {
    const { wrapper, handlerData, handlerState } = buildWrapper();
    getLeadFormSelectionByDocumentId.mockResolvedValueOnce({
      leadFormDocumentId: "lf_3",
      form: { title: "No Inputs", description: "No Inputs", inputs: [] },
    });

    const { result } = renderHook(() => useLeadButtonAction(), { wrapper });
    await act(async () => {
      await result.current.runLeadButtonAction({
        button: {
          identifier: 0,
          leadFormSelection: {
            leadFormDocumentId: "lf_3",
            form: { title: "Partial", description: "Partial", inputs: [] },
          } as any,
        },
        section: "plan",
      });
    });

    expect(handlerData).not.toHaveBeenCalled();
    expect(handlerState).not.toHaveBeenCalled();
  });

  it("calls submitForm and clears leadSelection for identifier 4 (lead)", async () => {
    const submitForm = jest.fn().mockResolvedValue(undefined);
    const { handlerState, handlerModalType, setSection, handlerData, setLeadSelection } = buildWrapper();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider value={{ state: false, handlerState, handlerModalType }}>
        <FormContactContext.Provider
          value={{ setSection, handlerData, setLeadSelection, submitForm }}
        >
          {children}
        </FormContactContext.Provider>
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useLeadButtonAction(), { wrapper });

    await act(async () => {
      await result.current.runLeadButtonAction({
        button: { identifier: 4 },
        section: "form-block",
      });
    });

    expect(setLeadSelection).toHaveBeenCalledWith(undefined);
    expect(submitForm).toHaveBeenCalled();
    expect(handlerState).not.toHaveBeenCalled();
  });

  it("calls onLead callback before submitForm for identifier 4", async () => {
    const submitForm = jest.fn().mockResolvedValue(undefined);
    const onLead = jest.fn();
    const callOrder: string[] = [];
    onLead.mockImplementation(() => callOrder.push("onLead"));
    submitForm.mockImplementation(() => { callOrder.push("submitForm"); return Promise.resolve(); });

    const { handlerState, handlerModalType, setSection, handlerData, setLeadSelection } = buildWrapper();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider value={{ state: false, handlerState, handlerModalType }}>
        <FormContactContext.Provider
          value={{ setSection, handlerData, setLeadSelection, submitForm }}
        >
          {children}
        </FormContactContext.Provider>
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useLeadButtonAction(), { wrapper });

    await act(async () => {
      await result.current.runLeadButtonAction({
        button: { identifier: 4 },
        section: "form-block",
        onLead,
      });
    });

    expect(onLead).toHaveBeenCalled();
    expect(submitForm).toHaveBeenCalled();
    expect(callOrder).toEqual(["onLead", "submitForm"]);
  });

  it("does not open modal and does not call whatsapp for identifier 4", async () => {
    const submitForm = jest.fn().mockResolvedValue(undefined);
    const onWhatsapp = jest.fn();
    const { handlerState, handlerModalType, setSection, handlerData, setLeadSelection } = buildWrapper();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider value={{ state: false, handlerState, handlerModalType }}>
        <FormContactContext.Provider
          value={{ setSection, handlerData, setLeadSelection, submitForm }}
        >
          {children}
        </FormContactContext.Provider>
      </ModalContext.Provider>
    );

    const { result } = renderHook(() => useLeadButtonAction(), { wrapper });

    await act(async () => {
      await result.current.runLeadButtonAction({
        button: { identifier: 4 },
        section: "form-block",
        onWhatsapp,
      });
    });

    expect(onWhatsapp).not.toHaveBeenCalled();
    expect(handlerState).not.toHaveBeenCalled();
    expect(handlerModalType).not.toHaveBeenCalled();
    expect(submitForm).toHaveBeenCalled();
  });
});
