"use client";

import { useEffect, useMemo, useState, type FC, type ReactNode } from "react";

type SemiautomaticFlowMainProps = {
  children: ReactNode;
  navbarVariant: string;
  className?: string;
};

const MOBILE_GAP = 28;
const DESKTOP_GAP = 16;
const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

export const SemiautomaticFlowMain: FC<SemiautomaticFlowMainProps> = ({
  children,
  navbarVariant,
  className
}) => {
  const [dynamicPaddingTop, setDynamicPaddingTop] = useState<number | null>(null);
  const shouldUseDynamicOffset = navbarVariant === "no_items";

  useEffect(() => {
    if (!shouldUseDynamicOffset || typeof window === "undefined") {
      setDynamicPaddingTop(null);
      return;
    }

    const findNavbar = () =>
      document.querySelector<HTMLElement>('div.fixed.top-2.z-40[data-state="closed"]');

    const updateOffset = () => {
      const navbar = findNavbar();
      if (!navbar) return;
      const isDesktop = window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
      const gap = isDesktop ? DESKTOP_GAP : MOBILE_GAP;
      const offset = Math.ceil(navbar.getBoundingClientRect().bottom + gap);
      setDynamicPaddingTop(offset);
    };

    updateOffset();

    const navbar = findNavbar();
    if (!navbar || typeof ResizeObserver === "undefined") return;

    const resizeObserver = new ResizeObserver(() => updateOffset());
    resizeObserver.observe(navbar);

    window.addEventListener("resize", updateOffset);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateOffset);
    };
  }, [shouldUseDynamicOffset]);

  const computedClassName = useMemo(() => {
    if (className) return className;
    if (navbarVariant === "none") return "pt-0";
    if (navbarVariant === "simple") return "pt-16";
    if (navbarVariant === "default") return "pt-16";
    return "pt-24";
  }, [className, navbarVariant]);

  return (
    <main
      role="main"
      className={computedClassName}
      style={dynamicPaddingTop == null ? undefined : { paddingTop: `${dynamicPaddingTop}px` }}
    >
      {children}
    </main>
  );
};
