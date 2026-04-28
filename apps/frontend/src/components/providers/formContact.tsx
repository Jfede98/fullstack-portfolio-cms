"use client";
import { type FC } from "react";
import { Provider } from "@context/formContact";
import { useContactForm } from "@hooks/providers/useContactForm";
import { TProvider } from "@interfaces/provider";

export const FormContactProvider: FC<TProvider> = ({ children }) => {
  const props = useContactForm();
  return <Provider value={props}>{children}</Provider>;
};
