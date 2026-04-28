import { renderHook } from "@testing-library/react";
import { useNavbar } from "@hooks/useNavbar";

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

describe("useNavbar", () => {
  beforeEach(() => {
    addEvent.mockReset();
    runLeadButtonAction.mockReset();
  });

  it("delegates modal/simple/whatsapp behavior to useLeadButtonAction", () => {
    const onClick = jest.fn();

    const { result } = renderHook(
      () =>
        useNavbar({
          buttonContact: { onClick, identifier: 0, leadFormSelection: { leadFormDocumentId: "x" } } as any
        } as any)
    );

    const event = { preventDefault: jest.fn() } as any;
    result.current.handlerContactButton(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(runLeadButtonAction).toHaveBeenCalledWith(
      expect.objectContaining({
        section: "menu",
        onModal: expect.any(Function),
        onWhatsapp: expect.any(Function),
        onSimple: expect.any(Function)
      })
    );

    const params = runLeadButtonAction.mock.calls[0][0];
    params.onSimple();
    expect(onClick).toHaveBeenCalled();

    params.onModal();
    expect(addEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "open_form",
        section: "menu",
        flow: "home",
        elementDescription: "contratar"
      })
    );

    params.onWhatsapp();
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(addEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "working_lead",
        section: "menu",
        flow: "home"
      })
    );
  });

  it("does not prevent default when button is not modal", () => {
    const { result } = renderHook(
      () =>
        useNavbar({
          buttonContact: { identifier: 2 } as any
        } as any)
    );

    const event = { preventDefault: jest.fn() } as any;
    result.current.handlerContactButton(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
