import { useGtm } from "./useGtm";
import { useCustomPathname } from "./useCustomPathname";
import type { IPlanCarouselButton } from "@interfaces/planCarousel";
import { useLeadButtonAction } from "./useLeadButtonAction";

export const useTestimonialCarousel = () => {
  const { addEvent } = useGtm();
  const pathname = useCustomPathname();
  const { runLeadButtonAction } = useLeadButtonAction();
  
  const handlerCtaButton = (button?: IPlanCarouselButton) => {
    const section = "reviews";
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
