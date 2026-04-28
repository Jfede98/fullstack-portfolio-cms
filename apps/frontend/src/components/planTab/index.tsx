"use client";

import type { FC } from "react";
import type { IPlanTab } from "@interfaces/components/planTab";
import { Tab } from "@sitio-publico/shared-ui";
import { planTabStyle } from "@components/planTab/style";
import { Typography } from "@sitio-publico/shared-ui";
import { usePlanTab } from "@hooks/usePlanTab";

export const PlanTab: FC<IPlanTab> = ({
  title,
  description,
  categories,
  gridRules,
  showCategoryHeader = true,
  className
}) => {
  const {
    activeDescription,
    activeTitle,
    tabs,
    activeIndex,
    handlerChangeTab,
    itemListRef
  } = usePlanTab({ categories, gridRules });

  const tabMode = tabs.length >= 4 ? "many" : tabs.length === 3 ? "three" : "two";

  const {
    section,
    titleContainer,
    titleText,
    descriptionText,
    categoryHeader,
    categoryTitle,
    categoryDescription,
    tabsTrigger,
    tabsTriggerElementWrapper,
    tabsTriggerLabel
  } = planTabStyle({ tabMode });

  return (
    <section className={[section(), className?.section].filter(Boolean).join(" ")}>
      {(title || description) && (
        <div className={titleContainer()}>
          {title?.text && (
            <Typography
              tag={title.tag}
              variant="h2"
              type="regular"
              className={{ base: titleText() }}
            >
              {title.text}
            </Typography>
          )}
          {description && (
            <Typography
              tag="p"
              variant="body"
              type="regular"
              className={{ base: descriptionText() }}
            >
              {description}
            </Typography>
          )}
        </div>
      )}
      {showCategoryHeader && (activeTitle?.text || activeDescription) && (
        <div className={categoryHeader()}>
          {activeTitle?.text && (
            <Typography
              tag={activeTitle?.tag ?? "h2"}
              variant="h3"
              type="regular"
              className={{ base: categoryTitle() }}
            >
              {activeTitle.text}
            </Typography>
          )}
          {activeDescription && (
            <Typography
              tag="p"
              variant="body"
              type="regular"
              className={{ base: categoryDescription() }}
            >
              {activeDescription}
            </Typography>
          )}
        </div>
      )}
      {tabs.length > 0 && (
        <div ref={itemListRef}>
          <Tab
            tabs={tabs}
            activeIndex={activeIndex}
            onChange={handlerChangeTab}
            className={{
              trigger: tabsTrigger(),
              triggerElementWrapper: tabsTriggerElementWrapper(),
              triggerLabel: tabsTriggerLabel()
            }}
          />
        </div>
      )}
    </section>
  );
};
