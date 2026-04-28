const loadFlowStateMock = jest.fn();
const saveFlowStateMock = jest.fn();

jest.mock("@store/semiautomaticFlow/persistence", () => ({
  loadFlowState: () => loadFlowStateMock(),
  saveFlowState: (...args: unknown[]) => saveFlowStateMock(...args),
  clearFlowState: jest.fn()
}));

describe("semiautomaticFlow store", () => {
  beforeEach(() => {
    loadFlowStateMock.mockReset();
    saveFlowStateMock.mockReset();
  });

  it("hydrates preloaded state and persists updates", async () => {
    loadFlowStateMock.mockReturnValue({
      leadId: "l1",
      phone: "099",
      documentNumber: "123",
      coverageCompleted: true
    });
    const { makeStore, setLeadData } = await import("@store/semiautomaticFlow");
    const store = makeStore();
    store.dispatch(
      setLeadData({ leadId: "l2", phone: "098", documentNumber: "456" })
    );
    expect(saveFlowStateMock).toHaveBeenCalled();
  });
});
