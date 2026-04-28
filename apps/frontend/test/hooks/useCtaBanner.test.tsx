import { renderHook } from "@testing-library/react";
import { useCtaBanner } from "@hooks/useCtaBanner";

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

describe("useCtaBanner", () => {
  beforeEach(() => {
    addEvent.mockReset();
    runLeadButtonAction.mockReset();
  });

  it("normalizes features and delegates CTA handling", () => {
    const { result } = renderHook(() => useCtaBanner());

    const features = result.current.normalizeCtaBannerFeatures([
      { iconName: "wifi", text: "Rapido" },
      { iconName: "", text: "Skip" }
    ] as any);

    expect(features).toEqual([{ iconName: "wifi", text: "Rapido" }]);

    const button = { identifier: 0 } as any;
    result.current.handlerCtaButton(button);

    expect(runLeadButtonAction).toHaveBeenCalledWith(
      expect.objectContaining({
        button,
        section: "banner-body",
        onModal: expect.any(Function),
        onWhatsapp: expect.any(Function)
      })
    );

    const params = runLeadButtonAction.mock.calls[0][0];
    params.onModal();
    expect(addEvent).toHaveBeenCalledWith(
      expect.objectContaining({ event: "open_form", flow: "home", section: "banner-body" })
    );

    params.onWhatsapp();
    expect(addEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "working_lead",
        flow: "home",
        section: "banner-body"
      })
    );
  });

  it("returns empty features when list is missing", () => {
    const { result } = renderHook(() => useCtaBanner());
    expect(result.current.normalizeCtaBannerFeatures(undefined)).toEqual([]);
  });

  it("filters out features without iconName", () => {
    const { result } = renderHook(() => useCtaBanner());
    const features = result.current.normalizeCtaBannerFeatures([
      { iconName: "", text: "Skip" },
      { iconName: "wifi", text: "" }
    ] as any);

    expect(features).toEqual([{ iconName: "wifi", text: "" }]);
  });

  it("handles undefined button in CTA handler", () => {
    const { result } = renderHook(() => useCtaBanner());
    result.current.handlerCtaButton(undefined);

    expect(runLeadButtonAction).toHaveBeenCalledWith(
      expect.objectContaining({
        button: undefined,
        section: "banner-body"
      })
    );
  });

  it("normalizes features safely when list contains null items", () => {
    const { result } = renderHook(() => useCtaBanner());
    const features = result.current.normalizeCtaBannerFeatures([
      null,
      { iconName: "wifi", text: "ok" }
    ] as any);

    expect(features).toEqual([{ iconName: "wifi", text: "ok" }]);
  });

  it("uses empty text fallback when feature text is undefined", () => {
    const { result } = renderHook(() => useCtaBanner());
    const features = result.current.normalizeCtaBannerFeatures([
      { iconName: "wifi" }
    ] as any);

    expect(features).toEqual([{ iconName: "wifi", text: "" }]);
  });
});
