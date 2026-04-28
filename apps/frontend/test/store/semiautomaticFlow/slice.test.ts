import reducer, {
  clearLeadData,
  clearSelectedPlan,
  setCoverageCompleted,
  setLeadData,
  setSelectedPlan
} from "@store/semiautomaticFlow/slice";

describe("semiautomaticFlow slice", () => {
  it("handles plan and lead actions", () => {
    const state = reducer(undefined, { type: "init" });
    const withPlan = reducer(state, setSelectedPlan({ id: 1 } as any));
    expect(withPlan.selectedPlan?.id).toBe(1);

    const withLead = reducer(
      withPlan,
      setLeadData({ leadId: "l1", phone: "099", documentNumber: "123" })
    );
    expect(withLead.leadId).toBe("l1");
    expect(withLead.phone).toBe("099");

    const cleared = reducer(withLead, clearLeadData());
    expect(cleared.leadId).toBeNull();

    const clearedPlan = reducer(withPlan, clearSelectedPlan());
    expect(clearedPlan.selectedPlan).toBeNull();
  });

  it("marks coverage completed", () => {
    const state = reducer(undefined, setCoverageCompleted(true));
    expect(state.coverageCompleted).toBe(true);
  });
});
