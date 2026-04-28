"use client";

import type { FC } from "react";
import type { IPlanCardData } from "@interfaces/components/planTab";
import { CarouselPlan } from "@components/planTabContent/carousel";
import { ClientPlanCard } from "@components/client/ClientPlanCard";

export const StepPlansContent: FC<{ plans: IPlanCardData[] }> = ({ plans }) => (
  <>
    <div className="mx-auto flex w-full max-w-[313px] flex-col gap-4 md:hidden">
      {plans.map((plan, index) => (
        <ClientPlanCard
          key={`semiauto-plan-mobile-${plan.name}-${index}`}
          {...plan}
          mobilePresentation="accordion"
          className={{
            wrapper: "!max-w-[312px]"
          }}
        />
      ))}
    </div>

    <div className="hidden md:block">
      <CarouselPlan data={plans} />
    </div>
  </>
);
