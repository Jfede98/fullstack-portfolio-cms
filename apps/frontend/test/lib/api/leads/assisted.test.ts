import { AssistedLeadErrorCode } from "@lib/constants/state";

const fetchLeadsTomMock = jest.fn();
const getTokenMock = jest.fn();

jest.mock("@lib/fetch", () => ({
  fetchLeadsTom: (...args: unknown[]) => fetchLeadsTomMock(...args)
}));

jest.mock("@lib/api/leads/tom", () => ({
  getTokenTomGestorLead: () => getTokenMock()
}));

describe("assisted lead api", () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    fetchLeadsTomMock.mockReset();
    getTokenMock.mockReset();
    getTokenMock.mockResolvedValue("token");
  });

  it("sendAssistedLead returns success when response is ok", async () => {
    const { sendAssistedLead } = await import("@lib/api/leads/assisted");
    fetchLeadsTomMock.mockResolvedValue({
      status: 201,
      body: JSON.stringify({ response: true, data: { lead: { _id: "lead-1" } } })
    });

    const res = await sendAssistedLead({
      customer: { phone: "099" }
    } as any);

    expect(res).toEqual({
      success: true,
      isDuplicate: false,
      errorCode: undefined,
      id: "lead-1",
      phone: "099"
    });
  });

  it("sendAssistedLead marks duplicate when message contains duplicate", async () => {
    const { sendAssistedLead } = await import("@lib/api/leads/assisted");
    fetchLeadsTomMock.mockResolvedValue({
      status: 400,
      body: JSON.stringify({
        response: false,
        message: AssistedLeadErrorCode.DUPLICATE
      })
    });

    const res = await sendAssistedLead({
      customer: { phone: "099" }
    } as any);

    expect(res?.isDuplicate).toBe(true);
    expect(res?.errorCode).toBe(AssistedLeadErrorCode.DUPLICATE);
  });

  it("sendAssistedLead returns null when response body includes error", async () => {
    const { sendAssistedLead } = await import("@lib/api/leads/assisted");
    fetchLeadsTomMock.mockResolvedValue({
      status: 500,
      body: "error: upstream"
    });

    const res = await sendAssistedLead({} as any);
    expect(res).toBeNull();
  });

  it("sendAssistedLead returns null when body is invalid", async () => {
    const { sendAssistedLead } = await import("@lib/api/leads/assisted");
    fetchLeadsTomMock.mockResolvedValue({
      status: 201,
      body: "not-json"
    });

    const res = await sendAssistedLead({} as any);
    expect(res).toBeNull();
  });

  it("sendAssistedLead returns null on server error", async () => {
    const { sendAssistedLead } = await import("@lib/api/leads/assisted");
    fetchLeadsTomMock.mockResolvedValue({
      status: 500,
      body: JSON.stringify({ response: false, message: "error" })
    });
    const res = await sendAssistedLead({} as any);
    expect(res).toBeNull();
  });

  it("updateAssistedLead returns error code for non-duplicate failures", async () => {
    const { updateAssistedLead } = await import("@lib/api/leads/assisted");
    fetchLeadsTomMock.mockResolvedValue({
      status: 400,
      body: JSON.stringify({ response: false, message: "bad" })
    });

    const res = await updateAssistedLead({ id: "a1" } as any);
    expect(res).toEqual({
      success: false,
      isDuplicate: false,
      errorCode: AssistedLeadErrorCode.ERROR,
      id: "a1",
      phone: undefined
    });
  });

  it("updateAssistedLead returns null when body is invalid", async () => {
    const { updateAssistedLead } = await import("@lib/api/leads/assisted");
    fetchLeadsTomMock.mockResolvedValue({
      status: 200,
      body: "not-json"
    });

    const res = await updateAssistedLead({ id: "a1" } as any);
    expect(res).toBeNull();
  });

  it("updateAssistedLead returns null when fetch throws", async () => {
    const { updateAssistedLead } = await import("@lib/api/leads/assisted");
    fetchLeadsTomMock.mockRejectedValue(new Error("fail"));

    const res = await updateAssistedLead({ id: "a1" } as any);
    expect(res).toBeNull();
  });

  it("updateAssistedLead marks duplicate when message contains fragment", async () => {
    const { updateAssistedLead } = await import("@lib/api/leads/assisted");
    fetchLeadsTomMock.mockResolvedValue({
      status: 400,
      body: JSON.stringify({
        response: false,
        message: "24 horas",
        serverMessage: ""
      })
    });

    const res = await updateAssistedLead({ id: "a1" } as any);
    expect(res?.isDuplicate).toBe(true);
  });
});
