import { useCallback } from "react";
import { useGtm } from "./useGtm";
import { useCustomPathname } from "./useCustomPathname";
import type {
  IStreamingPlan,
  ILeadAwareStreamingPlanCta,
} from "@interfaces/components/streamingPlans";
import { useLeadButtonAction } from "./useLeadButtonAction";

export const useStreamingPlanCard = (plans: IStreamingPlan[]) => {
  const { addEvent } = useGtm();
  const pathname = useCustomPathname();
  const { runLeadButtonAction } = useLeadButtonAction();
  const section = "streaming";

  const getItemPayload = useCallback(
    (plan?: IStreamingPlan) =>
      plan
        ? [
            {
              item_id: plan.title ?? "",
              item_name: plan.title ?? "",
              item_category: "streaming",
              brand: "streaming",
              price: "",
              quantity: 1
            }
          ]
        : undefined,
    []
  );

  const handlerButton = (cta?: ILeadAwareStreamingPlanCta, plan?: IStreamingPlan) => () => {
    void runLeadButtonAction({
      button: cta,
      section,
      onModal: () =>
        addEvent({
          event: "open_form",
          flow: pathname,
          section,
          elementDescription: "contratar",
          item: getItemPayload(plan)
        }),
      onWhatsapp: () =>
        addEvent({
          event: "working_lead",
          flow: pathname,
          section,
          elementDescription: "solicitar por whatsapp",
          item: getItemPayload(plan)
        })
    });
  };

  return {
    handlerButton
  };
};


