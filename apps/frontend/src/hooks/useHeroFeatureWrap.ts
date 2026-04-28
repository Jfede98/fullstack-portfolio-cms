import { useCallback, useEffect, useState, type RefObject } from "react";

const isWrapped = (container: HTMLElement): boolean => {
  const grids = Array.from(
    container.querySelectorAll("[data-hero-features]")
  ) as HTMLElement[];

  return grids.some((grid) => {
    const items = Array.from(grid.children) as HTMLElement[];
    if (items.length < 2) return false;

    const firstTop = items[0].offsetTop;
    return items.some((item) => item.offsetTop > firstTop + 1);
  });
};

export const useHeroFeatureWrap = (
  containerRef: RefObject<HTMLElement | null>,
  enabled = true
) => {
  const [wrapped, setWrapped] = useState(false);

  const updateWrap = useCallback(() => {
    if (!enabled) {
      setWrapped(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      setWrapped(isWrapped(container));
    });
  }, [containerRef, enabled]);

  useEffect(() => {
    if (!enabled) {
      setWrapped(false);
      return;
    }

    updateWrap();

    const handleResize = () => updateWrap();
    window.addEventListener("resize", handleResize);

    const observer = new ResizeObserver(() => updateWrap());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [containerRef, enabled, updateWrap]);

  return { wrapped, updateWrap };
};
