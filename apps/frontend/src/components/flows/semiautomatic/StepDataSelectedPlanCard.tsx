"use client";

import { useEffect, useState, type FC } from "react";
import { useSelector } from "react-redux";
import { Typography } from "@sitio-publico/shared-ui";
import type { RootState } from "@store/semiautomaticFlow";
import { ClientPlanCard } from "@components/client/ClientPlanCard";
import { ChangePlanModal } from "../automatic/ChangePlanModal";
import type { IPlanTab } from "@interfaces/components/planTab";

export const StepDataSelectedPlanCard: FC<{
  title?: string;
  actionLabel?: string;
  planTabData?: IPlanTab;
}> = ({
  title = "Tu plan seleccionado:",
  actionLabel = "Cambiar plan",
  planTabData
}) => {
  const selectedPlan = useSelector(
    (state: RootState) => state.semiautomaticFlow.selectedPlan
  );
  const [hasMounted, setHasMounted] = useState(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || !selectedPlan) return null;

  return (
    <>
      <div className="hidden w-full md:flex md:flex-col md:gap-4">
        <div className="flex items-center justify-between gap-4">
          <Typography
            tag="p"
            unstyled
            className={{ base: "text-[16px] leading-6 font-bold text-[#44224C]" }}
          >
            {title}
          </Typography>
          <button
            type="button"
            className="text-[14px] leading-6 font-medium text-[#83378F]"
            onClick={() => setIsChangePlanModalOpen(true)}
          >
            {actionLabel}
          </button>
        </div>

        <ClientPlanCard
          {...selectedPlan}
          ctaButtons={[]}
          desktopPresentation="pricing"
          mobilePresentation="accordion"
        />
      </div>
      <ChangePlanModal
        isOpen={isChangePlanModalOpen}
        onClose={() => setIsChangePlanModalOpen(false)}
        planTabData={planTabData}
      />
    </>
  );
};
