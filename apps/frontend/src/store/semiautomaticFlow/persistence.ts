import type { SemiautomaticFlowState } from "./slice";

const SESSION_KEY = "semiautomatic_flow_state";

export const loadFlowState = (): Partial<SemiautomaticFlowState> | undefined => {
  try {
    const serialized = sessionStorage.getItem(SESSION_KEY);
    if (!serialized) return undefined;
    return JSON.parse(serialized) as Partial<SemiautomaticFlowState>;
  } catch {
    return undefined;
  }
};

export const saveFlowState = (state: SemiautomaticFlowState): void => {
  try {
    const serialized = JSON.stringify(state);
    sessionStorage.setItem(SESSION_KEY, serialized);
  } catch {

  }
};


export const clearFlowState = (): void => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {

  }
};

