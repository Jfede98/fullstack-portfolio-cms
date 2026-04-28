// import { renderHook } from "@testing-library/react";
// import { useClientAttentionCard } from "./useClientAttentionCard";

const addEvent = jest.fn();

jest.mock("./useGtm", () => ({
  useGtm: () => ({ addEvent })
}));

describe("useClientAttentionCard", () => {
  // it("builds gtm event with normalized title", () => {
  //   const { result } = renderHook(() => useClientAttentionCard());
  //   result.current.handlerCtaButton("Atencion Express");

  //   expect(addEvent).toHaveBeenCalledWith({
  //     event: "working_lead",
  //     flow: "home",
  //     section: "canales-atencion-atencion-express",
  //     elementDescription: "atencion-express"
  //   });
  // });

  // it("handles missing title", () => {
  //   const { result } = renderHook(() => useClientAttentionCard());
  //   result.current.handlerCtaButton(undefined);

  //   expect(addEvent).toHaveBeenCalledWith({
  //     event: "working_lead",
  //     flow: "home",
  //     section: "canales-atencion-undefined",
  //     elementDescription: undefined
  //   });
  // });
});
