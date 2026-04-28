const fetchAdminTokenMock = jest.fn();
const fetchingWrapperErrorMock = jest.fn();

jest.mock("@lib/fetch", () => ({
  fetchAdminToken: (...args: unknown[]) => fetchAdminTokenMock(...args)
}));

jest.mock("@lib/api/utils", () => ({
  fetchingWrapperError: (...args: unknown[]) => fetchingWrapperErrorMock(...args)
}));

describe("dispatchLeadEmail", () => {
  beforeEach(() => {
    fetchAdminTokenMock.mockReset();
    fetchingWrapperErrorMock.mockReset();
  });

  it("returns response when wrapper succeeds", async () => {
    const { dispatchLeadEmail } = await import("@lib/api/leads/distribution");

    fetchAdminTokenMock.mockResolvedValue({
      success: true,
      sentCount: 1,
      totalRecipients: 1,
      distributionMode: "email"
    });
    fetchingWrapperErrorMock.mockImplementation(async ({ callback }: any) => callback());

    const res = await dispatchLeadEmail({
      leadData: { name: "x" }
    });

    expect(res?.success).toBe(true);
    expect(fetchAdminTokenMock).toHaveBeenCalled();
  });

  it("returns null when wrapper throws", async () => {
    const { dispatchLeadEmail } = await import("@lib/api/leads/distribution");
    fetchingWrapperErrorMock.mockImplementation(async () => {
      throw new Error("boom");
    });

    const res = await dispatchLeadEmail({
      leadData: { name: "x" }
    });

    expect(res).toBeNull();
  });
});
