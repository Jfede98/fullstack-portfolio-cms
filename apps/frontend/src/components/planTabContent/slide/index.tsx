import { ClientPlanCard } from "@components/client/ClientPlanCard";
import type { IPlanCardData } from "@interfaces/components/planTab";
import type { FC } from "react";

export const Slide: FC<IPlanCardData> = (props) => (
  <ClientPlanCard {...props} />
);
