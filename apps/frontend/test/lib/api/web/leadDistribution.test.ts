const fetchAdminTokenMock = jest.fn();
const fetchingWrapperErrorMock = jest.fn();

jest.mock("@lib/fetch", () => ({
  fetchAdminToken: (...args: unknown[]) => fetchAdminTokenMock(...args)
}));

jest.mock("@lib/api/utils", () => ({
  fetchingWrapperError: (...args: unknown[]) => fetchingWrapperErrorMock(...args)
}));

jest.mock("@lib/helpers/mappers/leadForm", () => ({
  mapLeadForm: (data: any) => (data ? { id: data.id } : undefined)
}));

jest.mock("@lib/helpers/mappers/leadRoutingConfig", () => ({
  mapLeadRoutingConfig: (data: any) => (data ? { id: data.id } : undefined)
}));

jest.mock("@lib/helpers/mappers/form", () => ({
  mapperForm: (form: any) => ({ ...form, inputs: [] })
}));

describe("leadDistribution api", () => {
  beforeEach(() => {
    fetchAdminTokenMock.mockReset();
    fetchingWrapperErrorMock.mockReset();
  });

  it("getLeadFormSelectionByDocumentId returns mapped selection", async () => {
    const { getLeadFormSelectionByDocumentId } = await import("@lib/api/web/leadDistribution");
    fetchingWrapperErrorMock.mockImplementation(async ({ callback }: any) => callback());
    fetchAdminTokenMock.mockResolvedValue({
      leadFormDocumentId: "doc",
      leadFormName: "Lead",
      channel: "web",
      variant: "DSA",
      automaticFlow: true,
      form: { title: "Form" },
      routingConfigDocumentId: "cfg",
      distributionMode: "tom"
    });

    const res = await getLeadFormSelectionByDocumentId("doc");
    expect(res?.form?.variant).toBe("dsa");
    expect(res?.distributionMode).toBe("tom");
  });

  it("getLeadFormSelectionByDocumentId returns undefined when id is empty", async () => {
    const { getLeadFormSelectionByDocumentId } = await import("@lib/api/web/leadDistribution");
    fetchingWrapperErrorMock.mockImplementation(async ({ callback }: any) => callback());
    const res = await getLeadFormSelectionByDocumentId("");
    expect(res).toBeUndefined();
    expect(fetchAdminTokenMock).not.toHaveBeenCalled();
  });

  it("getLeadForms maps and filters", async () => {
    const { getLeadForms } = await import("@lib/api/web/leadDistribution");
    fetchingWrapperErrorMock.mockImplementation(async ({ callback }: any) => callback());
    fetchAdminTokenMock.mockResolvedValue({ data: [{ id: 1 }, null] });
    const res = await getLeadForms();
    expect(res).toEqual([{ id: 1 }]);
  });

  it("getLeadRoutingConfigsByLeadForm returns empty when no id", async () => {
    const { getLeadRoutingConfigsByLeadForm } = await import("@lib/api/web/leadDistribution");
    fetchingWrapperErrorMock.mockImplementation(async ({ callback }: any) => callback());
    const res = await getLeadRoutingConfigsByLeadForm("");
    expect(res).toEqual([]);
  });

  it("getLeadRoutingConfigs maps configs when id provided", async () => {
    const { getLeadRoutingConfigs } = await import("@lib/api/web/leadDistribution");
    fetchingWrapperErrorMock.mockImplementation(async ({ callback }: any) => callback());
    fetchAdminTokenMock.mockResolvedValue({ data: [{ id: 2 }] });
    const res = await getLeadRoutingConfigs();
    expect(res).toEqual([{ id: 2 }]);
  });

  it("getLeadRoutingConfigsByLeadForm maps configs when id is provided", async () => {
    const { getLeadRoutingConfigsByLeadForm } = await import("@lib/api/web/leadDistribution");
    fetchingWrapperErrorMock.mockImplementation(async ({ callback }: any) => callback());
    fetchAdminTokenMock.mockResolvedValue({ data: [{ id: 9 }] });
    const res = await getLeadRoutingConfigsByLeadForm("doc-9");
    expect(res).toEqual([{ id: 9 }]);
  });

  it("getLeadFormSelectionByDocumentId returns undefined when missing data", async () => {
    const { getLeadFormSelectionByDocumentId } = await import("@lib/api/web/leadDistribution");
    fetchingWrapperErrorMock.mockImplementation(async ({ callback }: any) => callback());
    fetchAdminTokenMock.mockResolvedValue({ leadFormDocumentId: "doc", form: null });
    const res = await getLeadFormSelectionByDocumentId("doc");
    expect(res).toBeUndefined();
  });
});
