import type { IModalContext } from "@interfaces/context/modal";
import { createContext } from "react";

export const ModalContext = createContext<IModalContext>({
  state: false,
  modalData: null,
  handlerState: () => {},
  handlerModalData: () => {}
});

export const { Provider, Consumer } = ModalContext;
