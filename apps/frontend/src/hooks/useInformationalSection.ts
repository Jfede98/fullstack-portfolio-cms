import type { IInformationalSection } from "@interfaces/components/informationalSection";
import { useGtm } from "./useGtm";
import { useCustomPathname } from "./useCustomPathname";
import { useLeadButtonAction } from "./useLeadButtonAction";

type TButton = IInformationalSection["cta"];

export const useInformationalSection = () => {
  const { addEvent } = useGtm();
  const pathname = useCustomPathname();
  const { runLeadButtonAction } = useLeadButtonAction();
  const section = "informational-section";

  const handlerCtaButton = (button?: TButton) => {
    void runLeadButtonAction({
      button,
      section,
      onModal: () =>
        addEvent({
          event: "open_form",
          flow: pathname,
          section,
          elementDescription: "contratar"
        }),
      onWhatsapp: () =>
        addEvent({
          event: "working_lead",
          flow: pathname,
          section,
          elementDescription: "solicitar por whatsapp"
        })
    });
  };

  return {
    handlerCtaButton
  };
};

