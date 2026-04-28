"use client";

import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { type FC, useEffect } from "react";
import { TabStyles } from "./style";
import type { ITabProps } from "@shared-ui/interfaces/tab";
import { Icon } from "@shared-ui/components/icons";
import { Typography } from "@shared-ui/components/typography";
import { useTab } from "@shared-ui/hooks/useTab";

export const Tab: FC<ITabProps> = ({
  tabs,
  className,
  activeIndex,
  onChange,
  rounded = false
}) => {
  const isLargeMenu = !rounded && tabs.length >= 3;
  const {
    navRef,
    activeIndex: internalActiveIndex,
    handlerClickerActive
  } = useTab();

  const currentIndex = activeIndex ?? internalActiveIndex;

  useEffect(() => {
    if (activeIndex === undefined) return;
    handlerClickerActive(activeIndex);
  }, [activeIndex, handlerClickerActive]);

  const {
    base,
    trigger,
    triggerElementWrapper,
    triggerLabel,
    content,
    wrapperContent
  } = TabStyles({ isLargeMenu, rounded });

  const shouldShowNavigation = tabs.length > 1 || (tabs.length === 1 && tabs[0]?.label);

  return (
    <div className={clsx(base(), className?.base)}>
      {shouldShowNavigation && (
        <nav
          ref={navRef}
          className={clsx(trigger(), className?.trigger)}
          role="navigation"
        >
        {tabs.map((tab, idx) => {
          const isActive = currentIndex === idx;
          const isNextToActive = currentIndex === idx + 1;

          return (
            <button
              key={tab.id}
              onClick={() => {
                onChange?.(idx);
                handlerClickerActive(idx);
              }}
              className={clsx(
                triggerElementWrapper({ active: isActive }),
                isNextToActive && "after:hidden",
                className?.triggerElementWrapper
              )}
            >
              {tab?.icon && <Icon {...tab.icon} size="msm" />}

              {tab?.label && (
                <Typography
                  tag="span"
                  variant="body"
                  type="bold"
                  className={{
                    base: clsx(
                      triggerLabel({ active: isActive, rounded }),
                      className?.triggerLabel
                    )
                  }}
                >{tab.label}</Typography>
              )}
            </button>
          );
        })}
      </nav>
      )}

      <div className={clsx(wrapperContent(), className?.wrapperContent)}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={clsx(content(), className?.content)}
          >
            {tabs[currentIndex]?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
