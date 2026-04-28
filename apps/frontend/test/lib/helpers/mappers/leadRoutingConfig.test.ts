import { mapLeadRoutingConfig } from "@lib/helpers/mappers/leadRoutingConfig";

describe("mapLeadRoutingConfig", () => {
  it("maps routing config", () => {
    const res = mapLeadRoutingConfig({
      id: 1,
      documentId: "doc",
      name: "Config",
      isActive: false,
      distributionMode: "tom",
      lead_form: { documentId: "lf", name: "Lead", isActive: true }
    } as any);
    expect(res).toEqual({
      id: 1,
      documentId: "doc",
      name: "Config",
      isActive: false,
      distributionMode: "tom",
      leadForm: { documentId: "lf", name: "Lead", isActive: true }
    });
  });

  it("returns undefined when empty", () => {
    expect(mapLeadRoutingConfig(undefined)).toBeUndefined();
  });

  it("handles missing lead_form and inactive values gracefully", () => {
    const res = mapLeadRoutingConfig({
      id: 2,
      isActive: true,
      lead_form: null
    } as any);

    expect(res?.leadForm).toBeUndefined();
    expect(res?.isActive).toBe(true);
  });
});
