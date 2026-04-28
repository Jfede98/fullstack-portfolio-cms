import { clearFlowState, loadFlowState, saveFlowState } from "@store/semiautomaticFlow/persistence";

describe("semiautomaticFlow persistence", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("returns undefined when nothing stored", () => {
    expect(loadFlowState()).toBeUndefined();
  });

  it("saves and loads state", () => {
    saveFlowState({
      selectedPlan: null,
      leadId: "l1",
      phone: "099",
      documentNumber: "123",
      coverageCompleted: true
    });
    expect(loadFlowState()).toEqual({
      selectedPlan: null,
      leadId: "l1",
      phone: "099",
      documentNumber: "123",
      coverageCompleted: true
    });
  });

  it("clears stored state", () => {
    saveFlowState({
      selectedPlan: null,
      leadId: "l1",
      phone: "099",
      documentNumber: "123",
      coverageCompleted: true
    });
    clearFlowState();
    expect(loadFlowState()).toBeUndefined();
  });
});
