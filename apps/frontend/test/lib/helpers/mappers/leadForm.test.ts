import { mapLeadForm } from "@lib/helpers/mappers/leadForm";

jest.mock("@lib/helpers/mappers/leadRoutingConfig", () => ({
  mapLeadRoutingConfig: (data: any) => (data ? { id: data.id } : undefined)
}));

jest.mock("@lib/helpers/mappers/form", () => ({
  mapperForm: (form: any) => ({ ...form, inputs: [] })
}));

describe("mapLeadForm", () => {
  it("maps lead form and routing configs", () => {
    const res = mapLeadForm({
      id: 1,
      documentId: "doc",
      name: "Lead",
      channel: "web",
      variant: "DSA",
      isActive: false,
      automaticFlow: true,
      form: { title: "Form" },
      lead_routing_configs: [{ id: 10 }, null]
    } as any);

    expect(res?.variant).toBe("DSA");
    expect(res?.form?.variant).toBe("dsa");
    expect(res?.routingConfigs).toEqual([{ id: 10 }]);
  });

  it("returns undefined when no data", () => {
    expect(mapLeadForm(null)).toBeUndefined();
  });

  it("handles missing form fallbacks and empty routing configs", () => {
    const res = mapLeadForm({
      id: 2,
      isActive: true,
      lead_routing_configs: null
    } as any);

    expect(res?.routingConfigs).toEqual([]);
    expect(res?.form).toBeUndefined();
    expect(res?.variant).toBe("default");
    expect(res?.automaticFlow).toBe(false);
  });
});
