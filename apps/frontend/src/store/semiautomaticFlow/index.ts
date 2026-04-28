import { configureStore } from "@reduxjs/toolkit";
import semiautomaticFlowReducer from "./slice";
import { loadFlowState, saveFlowState } from "./persistence";

export {
  setSelectedPlan,
  clearSelectedPlan,
  setCoverageCompleted,
  setLeadData,
  clearLeadData
} from "./slice";
export { clearFlowState } from "./persistence";
export type { LeadData } from "./slice";

export const makeStore = () => {
  const preloadedState = loadFlowState();

  const store = configureStore({
    reducer: {
      semiautomaticFlow: semiautomaticFlowReducer
    },
    preloadedState: preloadedState
      ? {
          semiautomaticFlow: {
            selectedPlan: null,
            leadId: null,
            phone: null,
            documentNumber: null,
            coverageCompleted: false,
            ...preloadedState
          }
        }
      : undefined
  });

  store.subscribe(() => {
    saveFlowState(store.getState().semiautomaticFlow);
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
