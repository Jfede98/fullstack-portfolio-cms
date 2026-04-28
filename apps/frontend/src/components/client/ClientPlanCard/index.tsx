"use client";
import type { FC } from "react";
import { PlanCard } from "@sitio-publico/shared-ui";
import { ClientPlanCardStyle } from "./style";
import { usePlanPlanCard } from "@hooks/useClientPlanCard";
import type { IPlanCardData } from "@interfaces/components/planTab";

export const ClientPlanCard: FC<IPlanCardData> = (props) => {
  const { className, ...planProps } = props;
  const { handlerButton, handlerTrigger } = usePlanPlanCard(props);
  const styles = ClientPlanCardStyle({
    isRecommended: props.isRecommended
  });

  return (
    <PlanCard
      {...planProps}
      ctaButtons={props.ctaButtons.map((button) => {
        const safeButton = {
          ...(button as typeof button & { leadFormSelection?: unknown }),
        };
        if ("leadFormSelection" in safeButton) {
          delete (safeButton as { leadFormSelection?: unknown }).leadFormSelection;
        }
        return {
          ...safeButton,
          onClick: handlerButton(button)
        };
      })}
      triggerOnActive={handlerTrigger}
      className={{
        ...className,
        wrapper: [styles, className?.wrapper].filter(Boolean).join(" ")
      }}
    />
  );
};
