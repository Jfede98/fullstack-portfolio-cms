"use client";

import type { TProvider } from "@interfaces/provider";
import { type FC } from "react";
import { ModalProvider } from "./modal";
import { FormContactProvider } from "./formContact";
import TanStackQueryClientProvider from "./query";
import { SemiautomaticFlowReduxProvider } from "./SemiautomaticFlowReduxProvider";

export const RootLayoutProvider: FC<TProvider> = ({ children }) => (
  <SemiautomaticFlowReduxProvider>
    <TanStackQueryClientProvider>
      <ModalProvider>
        <FormContactProvider>{children}</FormContactProvider>
      </ModalProvider>
    </TanStackQueryClientProvider>
  </SemiautomaticFlowReduxProvider>
);
