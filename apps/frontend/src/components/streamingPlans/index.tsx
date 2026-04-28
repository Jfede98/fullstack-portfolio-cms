"use client";

import type { FC } from "react";
import type { IStreamingPlansProps } from "@interfaces/components/streamingPlans";
import { StreamingPlans as StreamingPlansUI } from "@sitio-publico/shared-ui";
import { useStreamingPlanCard } from "@hooks/useStreamingPlanCard";

export const StreamingPlans: FC<IStreamingPlansProps> = ({
  title,
  subtitle,
  plans
}) => {
  const { handlerButton } = useStreamingPlanCard(plans);

  const plansWithHandlers = plans.map((plan, planIndex) => ({
    ...plan,
    ctas: plan.ctas.map((cta) => {
      const safeCta = {
        ...(cta as typeof cta & { leadFormSelection?: unknown }),
      };
      if ("leadFormSelection" in safeCta) {
        delete (safeCta as { leadFormSelection?: unknown }).leadFormSelection;
      }
      return {
        ...safeCta,
        onClick: handlerButton(cta, plans[planIndex])
      };
    })
  }));

  return (
    <StreamingPlansUI
      title={title ?? { text: "", tag: "h2" }}
      subtitle={subtitle}
      plans={plansWithHandlers}
      layout={{
        mobile: "grid",
        desktop: "grid"
      }}
    />
  );
};
