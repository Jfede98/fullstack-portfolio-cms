import { useEffect, useRef, useState } from "react";

export const useTab = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeTabElement = navRef.current?.children[
      activeIndex
    ] as HTMLElement;
    if (activeTabElement && navRef.current) {
      const container = navRef.current;
      const scrollLeft =
        activeTabElement.offsetLeft -
        container.offsetWidth / 2 +
        activeTabElement.offsetWidth / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth"
      });
    }
  }, [activeIndex]);

  const handlerClickerActive = (idx: number) => setActiveIndex(idx);

  return {
    activeIndex,
    handlerClickerActive,
    navRef
  };
};
