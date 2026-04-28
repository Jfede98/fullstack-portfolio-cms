import { makeStore, setSelectedPlan, clearSelectedPlan, clearFlowState } from "@store/semiautomaticFlow";
import type { IPlanCardData } from "@interfaces/components/planTab";

const mockPlan: IPlanCardData = {
  name: "Plan Fibra 300",
  speedValue: "300",
  speedUnit: "Mbps",
  isRecommended: false,
  priceInfo: {
    amount: "$29.99",
    taxLabel: "+ IVA",
    originalPrice: "$39.99",
    legalDisclaimer: "Términos aplican",
    promoLabel: "Promoción"
  },
  ctaButtons: [{ label: "Contratar", identifier: 3 }],
  benefits: [],
  apps: []
};

describe("semiautomaticFlow Redux slice", () => {
  beforeEach(() => {
    clearFlowState();
  });

  it("initializes with selectedPlan as null", () => {
    const store = makeStore();
    expect(store.getState().semiautomaticFlow.selectedPlan).toBeNull();
  });

  it("setSelectedPlan stores the plan in state", () => {
    const store = makeStore();
    store.dispatch(setSelectedPlan(mockPlan));
    expect(store.getState().semiautomaticFlow.selectedPlan).toEqual(mockPlan);
  });

  it("clearSelectedPlan resets selectedPlan to null", () => {
    const store = makeStore();
    store.dispatch(setSelectedPlan(mockPlan));
    store.dispatch(clearSelectedPlan());
    expect(store.getState().semiautomaticFlow.selectedPlan).toBeNull();
  });

  it("setSelectedPlan replaces previous plan", () => {
    const store = makeStore();
    const planA = { ...mockPlan, name: "Plan A" };
    const planB = { ...mockPlan, name: "Plan B" };

    store.dispatch(setSelectedPlan(planA));
    store.dispatch(setSelectedPlan(planB));

    expect(store.getState().semiautomaticFlow.selectedPlan?.name).toBe("Plan B");
  });

  it("makeStore creates independent store instances", () => {
    const storeA = makeStore();
    const storeB = makeStore();

    storeA.dispatch(setSelectedPlan(mockPlan));

    expect(storeA.getState().semiautomaticFlow.selectedPlan).toEqual(mockPlan);
    expect(storeB.getState().semiautomaticFlow.selectedPlan).toBeNull();
  });
});
