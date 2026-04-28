import type { RenderModalType } from "@lib/constants/state";
import { ComponentType } from "react";

export type ModalType = Record<RenderModalType, ComponentType>;

export interface IModalContext {
  state: boolean;
  type?: RenderModalType;
  modalData?: any;
  handlerState: (state: boolean) => void;
  handlerModalType?: (type: RenderModalType) => void;
  handlerModalData?: (data: any) => void;
  handlerReset?: () => void;
}
