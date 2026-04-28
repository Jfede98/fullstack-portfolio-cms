import { renderHook } from "@testing-library/react";
import { useTestimonialCarousel } from "@hooks/useTestimonialCarousel";

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

describe("useTestimonialCarousel", () => {
  beforeEach(() => {
    addEvent.mockReset();
    runLeadButtonAction.mockReset();
  });

  it("delegates CTA handling to useLeadButtonAction and tracks onModal", () => {
    const { result } = renderHook(() => useTestimonialCarousel());

    const button = {
      label: "TEST",
      identifier: 0,
    };
    result.current.handlerCtaButton(button as any);

    expect(runLeadButtonAction).toHaveBeenCalledWith(
      expect.objectContaining({
        button,
        section: "reviews",
        onModal: expect.any(Function),
        onWhatsapp: expect.any(Function),
      })
    );

    const params = runLeadButtonAction.mock.calls[0][0];
    params.onModal();
    expect(addEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "open_form",
        flow: "home",
        section: "reviews",
        elementDescription: "contratar"
      })
    );

    params.onWhatsapp();
    expect(addEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "working_lead",
        flow: "home",
        section: "reviews",
        elementDescription: "solicitar por whatsapp"
      })
    );
  });
});
