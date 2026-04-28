import {
  setSelectedPlan,
  clearSelectedPlan,
  setCoverageCompleted,
  setLeadData,
  clearLeadData,
  makeStore
} from "@store/semiautomaticFlow";

describe("store/semiautomaticFlow/index", () => {
  it("exports actions correctly", () => {
    expect(typeof setSelectedPlan).toBe("function");
    expect(typeof clearSelectedPlan).toBe("function");
    expect(typeof setCoverageCompleted).toBe("function");
    expect(typeof setLeadData).toBe("function");
    expect(typeof clearLeadData).toBe("function");
  });

  it("makeStore initiates the store properly", () => {
    const store = makeStore();
    expect(store.getState().semiautomaticFlow).toBeDefined();
    expect(store.getState().semiautomaticFlow.coverageCompleted).toBe(false);
  });
});
