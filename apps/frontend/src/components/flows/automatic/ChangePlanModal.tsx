"use client";

import { type FC, useCallback } from "react";
import { Modal, Icon } from "@sitio-publico/shared-ui";
import { SemiautomaticFlowContext } from "@context/semiautomaticFlow";
import type { IPlanCardData, IPlanTab } from "@interfaces/components/planTab";
import { setSelectedPlan } from "@store/semiautomaticFlow";
import { useAppDispatch } from "@store/semiautomaticFlow/hooks";
import { Tab } from "@sitio-publico/shared-ui";
import { ClientPlanCard } from "@components/client/ClientPlanCard";
import { planTabStyle } from "@components/planTab/style";

export const ChangePlanModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  planTabData?: IPlanTab;
  title?: string;
}> = ({ isOpen, onClose, planTabData, title = "¡Escoge el plan ideal para ti!" }) => {
  const dispatch = useAppDispatch();
  const modalCategories = (planTabData?.categories ?? []).filter(
    (category) => (category.plans?.length ?? 0) > 0
  );
  const tabMode =
    modalCategories.length >= 4
      ? "many"
      : modalCategories.length === 3
        ? "three"
        : "two";
  const { tabsTrigger, tabsTriggerElementWrapper, tabsTriggerLabel } = planTabStyle({ tabMode });

  const handleSelectPlan = useCallback(
    (plan: IPlanCardData) => {
      dispatch(setSelectedPlan(plan));
      onClose();
    },
    [dispatch, onClose]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      size="full"
      className={{
        overlay: "px-4 py-6",
        base: "max-h-[calc(100dvh-48px)] w-full max-w-[361px] rounded-[16px] border-4 border-white/40 bg-white shadow-[0_4px_12px_rgba(159,98,176,0.25)] md:h-[688px] md:max-h-[688px] md:w-[474px] md:max-w-[474px]",
        body: "!px-6 !py-4"
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full justify-end">
          <button
            type="button"
            aria-label="Cerrar selector de planes"
            className="flex h-[35px] w-[35px] items-center justify-center text-[#44224C]"
            onClick={onClose}
          >
            <Icon
              name="close"
              type="rounded"
              size="md"
              className={{ base: "text-[#44224C]" }}
            />
          </button>
        </div>

        <h2 className="w-full text-center text-[22px] leading-7 font-normal text-[#44224C]">
          {title}
        </h2>

        <SemiautomaticFlowContext.Provider
          value={{
            onAddressChange: () => {},
            goToNextStep: () => {},
            selectPlan: handleSelectPlan,
            isActive: true
          }}
        >
          <div className="max-h-[548px] w-full max-w-[320px] overflow-y-auto md:max-w-[426px]">
            {planTabData ? (
              <Tab
                tabs={modalCategories.map((category, index) => ({
                    id: String(category.id ?? index),
                    label: (category.label ?? "").trim() || `Planes ${index + 1}`,
                    content: (
                      <div className="mx-auto flex w-full max-w-[312px] flex-col gap-4 pt-4">
                        {(category.plans ?? []).map((plan, planIndex) => (
                          <ClientPlanCard
                            key={`change-plan-modal-${plan.id ?? plan.name}-${planIndex}`}
                            {...plan}
                            desktopPresentation="mobile"
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
                    )
                  }))}
                className={{
                  trigger: tabsTrigger(),
                  triggerElementWrapper: tabsTriggerElementWrapper(),
                  triggerLabel: tabsTriggerLabel(),
                  wrapperContent: "py-0",
                  content: "w-full"
                }}
              />
            ) : (
              <div className="flex min-h-40 items-center justify-center py-8">
                <p className="text-center text-[16px] leading-6 text-[#2C2C30]">
                  No hay planes configurados para este selector.
                </p>
              </div>
            )}
          </div>
        </SemiautomaticFlowContext.Provider>
      </div>
    </Modal>
  );
};
