import type { TGtmEvent } from "@interfaces/lib/gtm";
import { DEFAULT_GTM_EVENT } from "@lib/constants/constants";
import { useCallback } from "react";

export const useGtm = () => {
  const formatPhone = useCallback(
    (phone: string, code: string) => code + phone.slice(1),
    []
  );

  const addEvent = useCallback(
    (event: TGtmEvent) => {
      if (!window) return;
      const dataLayer = window.dataLayer;
      const { ph, ...defaultEvent } = DEFAULT_GTM_EVENT;
      dataLayer?.push({
        ...defaultEvent,
        ...event,
        ph: event?.ph ? formatPhone(event.ph, "593") : ph
      });
    },
    [formatPhone]
  );

  return { addEvent };
};
