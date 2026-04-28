import type { FC } from "react";
import type { IPlanCategory } from "@interfaces/components/planTab";
import { CarouselPlan } from "./carousel";

export const PlanTabContent: FC<IPlanCategory> = ({ plans }) => {
  return plans && plans.length > 0 ? <CarouselPlan data={plans} /> : null;
};
