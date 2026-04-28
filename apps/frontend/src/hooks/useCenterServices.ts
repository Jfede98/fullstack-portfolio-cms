import { useContext } from "react";
import { ModalContext } from "@context/modal";
import { RenderModalType } from "@lib/constants/state";
import type { IButtonProps } from "@sitio-publico/shared-ui";

export const useCenterServices = () => {
  const { handlerState, handlerModalType, handlerModalData } = useContext(ModalContext);

  const openServicesModal = (centerName: string, services: string[], navigationButton?: IButtonProps) => {
    handlerModalData?.({ centerName, services, navigationButton });
    handlerModalType?.(RenderModalType.CENTER_SERVICES);
    handlerState(true);
  };

  return {
    openServicesModal
  };
};