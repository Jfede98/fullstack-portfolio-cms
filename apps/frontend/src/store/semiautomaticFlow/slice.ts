import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IPlanCardData } from "@interfaces/components/planTab";

export interface LeadData {
  leadId: string;
  phone: string;
  documentNumber: string;
}

export interface SemiautomaticFlowState {
  selectedPlan: IPlanCardData | null;
  leadId: string | null;
  phone: string | null;
  documentNumber: string | null;
  coverageCompleted: boolean;
}

const initialState: SemiautomaticFlowState = {
  selectedPlan: null,
  leadId: null,
  phone: null,
  documentNumber: null,
  coverageCompleted: false
};

const semiautomaticFlowSlice = createSlice({
  name: "semiautomaticFlow",
  initialState,
  reducers: {
    setSelectedPlan(state, action: PayloadAction<IPlanCardData>) {
      state.selectedPlan = action.payload as SemiautomaticFlowState["selectedPlan"];
    },
    clearSelectedPlan(state) {
      state.selectedPlan = null;
    },
    setCoverageCompleted(state, action: PayloadAction<boolean>) {
      state.coverageCompleted = action.payload;
    },
    setLeadData(state, action: PayloadAction<LeadData>) {
      state.leadId = action.payload.leadId;
      state.phone = action.payload.phone;
      state.documentNumber = action.payload.documentNumber;
    },
    clearLeadData(state) {
      state.leadId = null;
      state.phone = null;
      state.documentNumber = null;
    }
  }
});

export const {
  setSelectedPlan,
  clearSelectedPlan,
  setCoverageCompleted,
  setLeadData,
  clearLeadData
} =
  semiautomaticFlowSlice.actions;
export default semiautomaticFlowSlice.reducer;
