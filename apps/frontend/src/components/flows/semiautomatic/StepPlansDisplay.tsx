"use client";

import type { FC } from "react";
import { Tab } from "@sitio-publico/shared-ui";
import type { IPlanTab } from "@interfaces/components/planTab";
import { PlanTab } from "@components/planTab";
import { planTabStyle } from "@components/planTab/style";
import { ClientPlanCard } from "@components/client/ClientPlanCard";

interface StepPlansDisplayProps {
  planTabData: IPlanTab;
}

export const StepPlansDisplay: FC<StepPlansDisplayProps> = ({ planTabData }) => {
  const mobileCategories = (planTabData.categories ?? []).filter(
    (category) => (category.plans?.length ?? 0) > 0
  );
  const tabMode =
    mobileCategories.length >= 4
      ? "many"
      : mobileCategories.length === 3
        ? "three"
        : "two";
  const {
    tabsTrigger,
    tabsTriggerElementWrapper,
    tabsTriggerLabel
  } = planTabStyle({ tabMode });

  const renderMobilePlans = (
    plans: NonNullable<IPlanTab["categories"]>[number]["plans"] = []
  ) => (
    <div className="mx-auto flex w-full max-w-[312px] flex-col gap-4 pt-4 md:hidden">
      {plans.map((plan, index) => (
        <ClientPlanCard
          key={`semiauto-plan-mobile-${plan.id ?? plan.name}-${index}`}
          {...plan}
          mobilePresentation="accordion"
            className={{
              ...plan.className,
              wrapper: [
                "!max-w-[312px]",
                "!bg-transparent",
                "!border-0",
                "!shadow-none",
                "!rounded-none",
                plan.className?.wrapper
              ].filter(Boolean).join(" ")
            }}
          />
      ))}
    </div>
  );

  return (
    <>
      <div className="md:hidden">
        <Tab
          tabs={mobileCategories.map((category, index) => ({
            id: String(category.id ?? index),
            label: (category.label ?? "").trim() || `Planes ${index + 1}`,
            content: renderMobilePlans(category.plans)
          }))}
          className={{
            trigger: tabsTrigger(),
            triggerElementWrapper: tabsTriggerElementWrapper(),
            triggerLabel: tabsTriggerLabel(),
            wrapperContent: "py-0",
            content: "w-full"
          }}
        />
      </div>

      <div className="hidden md:block">
        <PlanTab
          {...planTabData}
          showCategoryHeader={false}
          className={{ section: "!px-0 !pt-0 !mt-0 !max-w-none" }}
        />
      </div>
    </>
  );
};
