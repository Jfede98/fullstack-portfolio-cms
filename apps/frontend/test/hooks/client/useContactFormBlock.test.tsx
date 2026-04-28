import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useContactFormBlock } from "@hooks/client/useContactFormBlock";
import { FormContactContext } from "@context/formContact";
import { getLeadFormSelectionByDocumentId } from "@lib/api/web/leadDistribution";

jest.mock("@lib/api/web/leadDistribution", () => ({
  getLeadFormSelectionByDocumentId: jest.fn()
}));

const mockedGetLeadFormSelectionByDocumentId = jest.mocked(
  getLeadFormSelectionByDocumentId
);

describe("useContactFormBlock", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetLeadFormSelectionByDocumentId.mockResolvedValue(undefined);
  });

  it("initializes handlerData only on mount", async () => {
    const handlerData = jest.fn();
    const setLeadSelection = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FormContactContext.Provider value={{ handlerData, setLeadSelection }}>
        {children}
      </FormContactContext.Provider>
    );

    const { rerender } = renderHook(
      ({ props }) => useContactFormBlock(props),
      {
        wrapper,
        initialProps: { props: { title: "A" } as any }
      }
    );

    expect(handlerData).toHaveBeenCalledWith({ title: "A" });
    await waitFor(() => {
      expect(setLeadSelection).toHaveBeenCalledWith(undefined);
    });

    rerender({ props: { title: "B" } as any });
    expect(handlerData).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(setLeadSelection).toHaveBeenCalledWith(undefined);
    });
  });

  it("sets leadSelection when form block contains it", async () => {
    const handlerData = jest.fn();
    const setLeadSelection = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FormContactContext.Provider value={{ handlerData, setLeadSelection }}>
        {children}
      </FormContactContext.Provider>
    );

    const leadSelection = {
      leadFormDocumentId: "lead-form-1",
      routingConfigDocumentId: "routing-1",
      distributionMode: "both",
      channel: "Sitio web"
    } as const;

    renderHook(
      () =>
        useContactFormBlock({
          title: "A",
          leadSelection
        } as any),
      { wrapper }
    );

    await waitFor(() => {
      expect(setLeadSelection).toHaveBeenCalledWith(leadSelection);
    });
  });

  it("hydrates leadSelection when routing data is incomplete", async () => {
    const handlerData = jest.fn();
    const setLeadSelection = jest.fn();

    mockedGetLeadFormSelectionByDocumentId.mockResolvedValue({
      leadFormDocumentId: "lead-form-1",
      leadFormName: "Formulario Hero",
      channel: "Sitio web",
      distributionMode: "both",
      routingConfigDocumentId: "routing-1",
      form: {
        title: "Formulario",
        description: "Desc",
        inputs: []
      } as any
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FormContactContext.Provider value={{ handlerData, setLeadSelection }}>
        {children}
      </FormContactContext.Provider>
    );

    renderHook(
      () =>
        useContactFormBlock({
          title: "A",
          leadSelection: {
            leadFormDocumentId: "lead-form-1",
            form: { title: "Local", description: "Local", inputs: [] } as any
          }
        } as any),
      { wrapper }
    );

    await waitFor(() => {
      expect(mockedGetLeadFormSelectionByDocumentId).toHaveBeenCalledWith(
        "lead-form-1"
      );
      expect(setLeadSelection).toHaveBeenCalledWith(
        expect.objectContaining({
          leadFormDocumentId: "lead-form-1",
          distributionMode: "both",
          routingConfigDocumentId: "routing-1",
          channel: "Sitio web"
        })
      );
    });
  });

  it("does not update selection when promise resolves after unmount", async () => {
    const handlerData = jest.fn();
    const setLeadSelection = jest.fn();

    let resolver: (value: any) => void = () => undefined;
    const deferred = new Promise((resolve) => {
      resolver = resolve;
    });
    mockedGetLeadFormSelectionByDocumentId.mockReturnValueOnce(
      deferred as any
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FormContactContext.Provider value={{ handlerData, setLeadSelection }}>
        {children}
      </FormContactContext.Provider>
    );

    const { unmount } = renderHook(
      () =>
        useContactFormBlock({
          title: "A",
          leadSelection: {
            leadFormDocumentId: "lead-form-1",
            form: { title: "Local", description: "Local", inputs: [] } as any
          }
        } as any),
      { wrapper }
    );

    unmount();
    await Promise.resolve();
    resolver({
      leadFormDocumentId: "lead-form-1",
      channel: "Sitio web",
      distributionMode: "email",
      routingConfigDocumentId: "routing-1"
    });
    await Promise.resolve();

    expect(setLeadSelection).not.toHaveBeenCalledWith(
      expect.objectContaining({
        routingConfigDocumentId: "routing-1"
      })
    );
  });

  it("skips handler when props are missing", () => {
    const handlerData = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FormContactContext.Provider value={{ handlerData }}>
        {children}
      </FormContactContext.Provider>
    );

    renderHook(() => useContactFormBlock(undefined as any), { wrapper });

    expect(handlerData).not.toHaveBeenCalled();
  });
});
