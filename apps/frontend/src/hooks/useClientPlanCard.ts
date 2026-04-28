import type { IPlanCardData } from "@interfaces/components/planTab";
import { useGtm } from "./useGtm";
import { useCallback, useContext, useEffect } from "react";
import { ModalContext } from "@context/modal";
import { FormContactContext } from "@context/formContact";
import { SemiautomaticFlowContext } from "@context/semiautomaticFlow";
import { useCustomPathname } from "./useCustomPathname";
import type { IPlanCtaButton } from "@interfaces/components/planTab";
import { useLeadButtonAction } from "./useLeadButtonAction";

export const usePlanPlanCard = (plan: IPlanCardData) => {
  const { addEvent } = useGtm();
  const pathname = useCustomPathname();
  const {
    state: modalState,
  } = useContext(ModalContext);
  const { runLeadButtonAction } = useLeadButtonAction();
  const { setPlan } = useContext(FormContactContext);
  const { goToNextStep, selectPlan, isActive } = useContext(SemiautomaticFlowContext);
  const section = "plan";

  useEffect(() => {
    if (modalState) return;
    setPlan?.(undefined);
  }, [modalState]);

  const gtmEvent = useCallback(() => {
    addEvent({
      event: "open_form",
      flow: pathname,
      section,
      elementDescription: "contratar",
      item: [
        {
          item_id: plan?.id ?? "",
          item_name: plan?.name ?? "",
          item_category: plan?.speedUnit ?? "",
          brand: "plan",
          price: plan?.priceInfo?.amount?.replace("*", ""),
          quantity: 1
        }
      ]
    });
  }, [addEvent, pathname, section, plan]);

  const handlerButton = (button?: IPlanCtaButton) => () => {
    if (isActive && (button?.identifier === 0 || button?.identifier === undefined)) {
      gtmEvent();
      selectPlan(plan);
      goToNextStep();
      return;
    }
    void runLeadButtonAction({
      button,
      section,
      onModal: () => {
        gtmEvent();
        setPlan?.(plan);
      },
      onWhatsapp: () =>
        addEvent({
          event: "working_lead",
          flow: pathname,
          section,
          elementDescription: "solicitar por whatsapp"
        }),
      onSemiautomaticFlow: () => {
        selectPlan(plan);
        goToNextStep();
      }
    });
  };

  const handlerTrigger = () =>
    addEvent({
      event: "view_promotion",
      flow: pathname,
      section,
      elementDescription: "ver detalles"
    });

  return {
    handlerButton,
    handlerTrigger
  };
};
