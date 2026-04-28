const getLeadFormSelectionByDocumentIdMock = jest.fn();

jest.mock("@lib/api/web/leadDistribution", () => ({
  getLeadFormSelectionByDocumentId: (...args: unknown[]) =>
    getLeadFormSelectionByDocumentIdMock(...args)
}));

import {
  hasRenderableInputs,
  hasRequiredRoutingData,
  resolveLeadSelection
} from "@lib/helpers/leadSelection";

describe("leadSelection helpers", () => {
  beforeEach(() => {
    getLeadFormSelectionByDocumentIdMock.mockReset();
  });

  it("detects renderable inputs", () => {
    expect(
      hasRenderableInputs({
        form: { inputs: [{ name: "phone", type: "tel" }] } as any
      })
    ).toBe(true);
    expect(hasRenderableInputs({ form: { inputs: [] } as any })).toBe(false);
  });

  it("detects required routing data", () => {
    expect(
      hasRequiredRoutingData({
        channel: "web",
        distributionMode: "tom",
        routingConfigDocumentId: "cfg"
      } as any)
    ).toBe(true);
    expect(hasRequiredRoutingData({} as any)).toBe(false);
  });

  it("returns selection when hydration not needed", async () => {
    const selection = {
      leadFormDocumentId: "x",
      form: { inputs: [{ name: "phone", type: "tel" }] }
    } as any;
    const res = await resolveLeadSelection(selection);
    expect(res).toBe(selection);
  });

  it("hydrates selection when inputs missing or options incomplete", async () => {
    getLeadFormSelectionByDocumentIdMock.mockResolvedValue({
      leadFormDocumentId: "x",
      leadFormName: "Lead",
      variant: "DSA",
      form: { inputs: [{ name: "city", type: "combobox", optionsSource: "api" }] },
      channel: "web",
      routingConfigDocumentId: "cfg",
      distributionMode: "tom"
    });

    const selection = {
      leadFormDocumentId: "x",
      form: { inputs: [{ name: "city", type: "combobox" }] }
    } as any;
    const res = await resolveLeadSelection(selection);
    expect(res?.routingConfigDocumentId).toBe("cfg");
    expect(res?.routingConfigDocumentId).toBe("cfg");
  });

  it("hydrates selection when static combobox options are missing", async () => {
    getLeadFormSelectionByDocumentIdMock.mockResolvedValue({
      leadFormDocumentId: "y",
      leadFormName: "Lead",
      form: { inputs: [{ name: "city", type: "combobox", options: [{ label: "Q", value: "Q" }] }] },
      channel: "web",
      routingConfigDocumentId: "cfg2",
      distributionMode: "tom"
    });

    const selection = {
      leadFormDocumentId: "y",
      form: { inputs: [{ name: "city", type: "combobox", options: [] }] },
      channel: "web",
      routingConfigDocumentId: "cfg2",
      distributionMode: "tom"
    } as any;

    const res = await resolveLeadSelection(selection);
    expect(res?.leadFormDocumentId).toBe("y");
    expect(res?.form?.inputs?.[0]?.options?.length).toBe(1);
  });

  it("returns original selection when hydration yields no result", async () => {
    getLeadFormSelectionByDocumentIdMock.mockResolvedValue(undefined);
    const selection = {
      leadFormDocumentId: "z",
      form: { inputs: [{ name: "phone", type: "tel" }] },
      channel: "web",
      routingConfigDocumentId: "cfg3",
      distributionMode: "tom"
    } as any;
    const res = await resolveLeadSelection(selection);
    expect(res).toBe(selection);
  });
});
