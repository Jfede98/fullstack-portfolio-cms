import { createContext } from "react";
import type { IAddressCoordinates } from "@context/cityMap";
import type { IPlanCardData } from "@interfaces/components/planTab";

export interface ISemiautomaticFlowContext {
  onAddressChange: (address: IAddressCoordinates | null) => void;
  goToNextStep: () => void;
  selectPlan: (plan: IPlanCardData) => void;
  isActive: boolean;
}

export const SemiautomaticFlowContext =
  createContext<ISemiautomaticFlowContext>({
    onAddressChange: () => {},
    goToNextStep: () => {},
    selectPlan: () => {},
    isActive: false
  });

