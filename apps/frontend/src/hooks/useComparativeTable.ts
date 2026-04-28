import { useCallback, useEffect, useRef } from "react";
import { useGtm } from "./useGtm";
import { useCustomPathname } from "./useCustomPathname";
import type { IComparativeSection } from "@interfaces/components/comparativeTable";
import type { ILeadAwareButton } from "@interfaces/components/comparativeTable";
import { useLeadButtonAction } from "./useLeadButtonAction";

export const useComparativeTable = (sections?: IComparativeSection[]) => {
  const { addEvent } = useGtm();
  const pathname = useCustomPathname();
  const { runLeadButtonAction } = useLeadButtonAction();
  const section = "lista-planes-comparativo";
  const containerRef = useRef<HTMLDivElement>(null);

  const getAllItemsPayload = useCallback(
    () =>
      sections
        ?.map((s) => ({
          item_id: s.label ?? "",
          item_name: s.label ?? "",
          item_category: "comparative",
          brand: "plan",
          price: s.plan?.price?.toString() ?? "",
          quantity: 1
        })) ?? [],
    [sections]
  );

  const getItemPayload = useCallback(
    (comparativeSection?: IComparativeSection) =>
      comparativeSection
        ? [
            {
              item_id: comparativeSection.label ?? "",
              item_name: comparativeSection.label ?? "",
              item_category: "comparative",
              brand: "plan",
              price: comparativeSection.plan?.price?.toString() ?? "",
              quantity: 1
            }
          ]
        : undefined,
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        addEvent({
          event: "view_item_list",
          flow: pathname,
          section,
          elementDescription: "comparativo-planes",
          item: getAllItemsPayload()
        });
        observer.unobserve(el);
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, []);

  const handlerButton = (
    button?: ILeadAwareButton,
    comparativeSection?: IComparativeSection
  ) => () => {
    void runLeadButtonAction({
      button,
      section,
      onModal: () =>
        addEvent({
          event: "open_form",
          flow: pathname,
          section,
          elementDescription: "contratar",
          item: getItemPayload(comparativeSection)
        }),
      onWhatsapp: () =>
        addEvent({
          event: "working_lead",
          flow: pathname,
          section,
          elementDescription: "solicitar por whatsapp",
          item: getItemPayload(comparativeSection)
        })
    });
  };

  return {
    handlerButton,
    containerRef
  };
};
