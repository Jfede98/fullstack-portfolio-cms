import type { ICTABanner } from "@interfaces/components/ctaBanner";
import { ICTABenefitsProps } from "@sitio-publico/shared-ui";
import { useGtm } from "./useGtm";
import { useCustomPathname } from "./useCustomPathname";
import type { TMappedButton } from "@lib/helpers/mappers/button";
import { useLeadButtonAction } from "./useLeadButtonAction";

export const useCtaBanner = () => {
  const { addEvent } = useGtm();
  const pathname = useCustomPathname();
  const { runLeadButtonAction } = useLeadButtonAction();

  const handlerCtaButton = (button?: TMappedButton) => {
    const section = "banner-body";
    void runLeadButtonAction({
      button,
      section,
      onModal: () =>
        addEvent({
          event: "open_form",
          flow: pathname,
          section,
          elementDescription: "contratalo"
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

  const normalizeCtaBannerFeatures = (
    features?: ICTABanner["features"]
  ): ICTABenefitsProps["features"] => {
    if (!features?.length) return [];

    return features
      .filter((feature) => Boolean(feature?.iconName))
      .map((feature) => ({
        iconName: String(feature?.iconName),
        text: feature?.text ?? ""
      }));
  };

  return {
    normalizeCtaBannerFeatures,
    handlerCtaButton
  };
};
