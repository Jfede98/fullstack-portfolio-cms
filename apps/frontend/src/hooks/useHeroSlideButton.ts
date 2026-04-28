import { useGtm } from "./useGtm";
import { useCustomPathname } from "./useCustomPathname";
import type { TMappedButton } from "@lib/helpers/mappers/button";
import { useLeadButtonAction } from "./useLeadButtonAction";
import type { ILeadFormSelection } from "@interfaces/coverageForm";

type TFeatureButton = {
  identifier?: number;
  leadFormSelection?: ILeadFormSelection;
  text?: string;
};

export const useHeroSlideButton = () => {
  const { addEvent } = useGtm();
  const pathname = useCustomPathname();
  const { runLeadButtonAction } = useLeadButtonAction();

  const section = "hero";

  const handlerCtaButton = (button?: TMappedButton) => () => {
    void runLeadButtonAction({
      button,
      section,
      onModal: () =>
        addEvent({
          event: "open_form",
          flow: pathname,
          section,
          elementDescription: (button?.children as string) ?? "hero-cta"
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

  const handlerFeatureButton = (feature: TFeatureButton) => () => {
    if (feature.identifier === undefined) return;
    void runLeadButtonAction({
      button: feature,
      section,
      onModal: () =>
        addEvent({
          event: "open_form",
          flow: pathname,
          section,
          elementDescription: feature.text ?? "hero-feature"
        }),
      onWhatsapp: () =>
        addEvent({
          event: "working_lead",
          flow: pathname,
          section,
          elementDescription: feature.text ?? "solicitar por whatsapp"
        })
    });
  };

  return { handlerCtaButton, handlerFeatureButton };
};
