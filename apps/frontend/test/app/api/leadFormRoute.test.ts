const getLeadFormSelectionByDocumentId = jest.fn();

jest.mock("@lib/api/web/leadDistribution", () => ({
  getLeadFormSelectionByDocumentId: (...args: unknown[]) =>
    getLeadFormSelectionByDocumentId(...args),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

const loadGet = async () => {
  const mod = await import("../../../src/app/api/lead-form/[documentId]/route");
  return mod.GET;
};

describe("lead-form route handler", () => {
  beforeEach(() => {
    getLeadFormSelectionByDocumentId.mockReset();
  });

  it("returns 400 when documentId is empty", async () => {
    const GET = await loadGet();

    const response = await GET({} as any, {
      params: Promise.resolve({ documentId: "" }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "documentId is required",
    });
  });

  it("returns 404 when lead form selection is missing or incomplete", async () => {
    const GET = await loadGet();
    getLeadFormSelectionByDocumentId.mockResolvedValueOnce(undefined);

    const response = await GET({} as any, {
      params: Promise.resolve({ documentId: "lf_missing" }),
    });

    expect(getLeadFormSelectionByDocumentId).toHaveBeenCalledWith("lf_missing");
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Lead form not found or incomplete",
    });
  });

  it("returns 200 with lead form selection payload", async () => {
    const GET = await loadGet();
    const selection = {
      leadFormDocumentId: "lf_1",
      leadFormName: "Formulario",
      form: {
        title: "Formulario",
        description: "Desc",
        inputs: [{ name: "email", type: "email" }],
      },
      routingConfigDocumentId: "rc_1",
      distributionMode: "email",
    };
    getLeadFormSelectionByDocumentId.mockResolvedValueOnce(selection);

    const response = await GET({} as any, {
      params: Promise.resolve({ documentId: "lf_1" }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(selection);
  });
});
