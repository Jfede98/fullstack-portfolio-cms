import type { IPlanTab } from "@interfaces/components/planTab";
import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useGtm } from "./useGtm";
import { PlanTabContent } from "@components/planTabContent";
import { useCustomPathname } from "@hooks/useCustomPathname.ts";

export const usePlanTab = ({
  categories,
  gridRules
}: Pick<IPlanTab, "categories" | "gridRules">) => {
  const { addEvent } = useGtm();
  const pathname = useCustomPathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const itemListRef = useRef<HTMLDivElement>(null);

  const tabs = useMemo(() => {
    return (
      categories?.map((category, index) => ({
        id: String(category.id ?? index),
        label: (category.label ?? "").replace(/\s+/g, " ").trim(),
        icon: category.icon?.name
          ? {
              name: category.icon.name,
              type: category.icon.type
            }
          : undefined,
        content: createElement(PlanTabContent, category)
      })) ?? []
    );
  }, [categories, gridRules]);

  const activeCategory = categories?.[activeIndex];
  const activeDescription = activeCategory?.description ?? "";
  const activeTitle =
    activeCategory?.title ??
    (activeCategory?.label ? { text: activeCategory.label } : undefined);

  const defaultListGtm = useCallback(
    (index: number, isListEvent = false) => {
      const category = categories?.[index];
      const planes = category?.plans ?? [];
      const labelString = category?.label ?? "";

      addEvent({
        event: isListEvent ? "view_item_list" : "view_item",
        section: isListEvent ? "lista-planes" : "planes",
        flow: pathname,
        elementDescription: labelString.toLowerCase(),
        item: planes.map((p) => ({
          item_id: p?.id ?? "",
          item_name: p.name,
          item_category: p.speedUnit ?? "",
          brand: "plan",
          price: p.priceInfo.amount?.replace("*", ""),
          quantity: 1
        }))
      });
    },
    [addEvent]
  );

  const handlerChangeTab = (index: number) => {
    setActiveIndex(index);
    defaultListGtm(index);
    defaultListGtm(index, true);
  };

  useEffect(() => {
    const el = itemListRef.current;
    if (!el) return;

    const objFunc = (x: IntersectionObserverEntry) => {
      if (!x.isIntersecting) return;
      defaultListGtm(0, true);
      observer.unobserve(el);
    };

    const observer = new IntersectionObserver((x) => x.forEach(objFunc), {
      threshold: 0.25
    });

    observer.observe(el);

    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, []);

  return {
    activeTitle,
    activeDescription,
    handlerChangeTab,
    activeIndex,
    itemListRef,
    tabs
  };
};
