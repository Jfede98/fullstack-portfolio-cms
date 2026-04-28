"use client";
import { type FC } from "react";
import { Provider } from "@context/modal";
import { useModal } from "@hooks/providers/useModal";
import { TProvider } from "@interfaces/provider";

export const ModalProvider: FC<TProvider> = ({ children }) => {
  const props = useModal();
  return <Provider value={props}>{children}</Provider>;
};
