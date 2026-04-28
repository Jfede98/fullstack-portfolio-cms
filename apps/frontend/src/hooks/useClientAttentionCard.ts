import { useCallback } from "react";
import { useGtm } from "./useGtm";
import { useMatchMedia } from "@sitio-publico/shared-ui";
import { useCustomPathname } from "@hooks/useCustomPathname.ts";

export const useClientAttentionCard = ({
  href,
  title
}: {
  href?: string;
  title?: string;
}) => {
  const pathname = useCustomPathname();
  const { addEvent } = useGtm();
  const { isDesktop } = useMatchMedia();

  const gtmEvent = useCallback(() => {
    const el = title?.toLowerCase().replace(/\s/g, "-");

    addEvent({
      event: "working_lead",
      flow: pathname,
      section: `canales-atencion-${el}`,
      elementDescription: el
    });
  }, [addEvent, title]);

  const handlerCtaButton = useCallback(() => {
    window?.open(href ?? "", "_blank");
    gtmEvent();
  }, [href]);

  return {
    handlerCtaButton,
    gtmEvent,
    isDesktop
  };
};
