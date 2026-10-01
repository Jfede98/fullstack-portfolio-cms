"use client";

import type { TProvider } from "@interfaces/provider";
import { type FC } from "react";
import { ModalProvider } from "./modal";
import { FormContactProvider } from "./formContact";
import TanStackQueryClientProvider from "./query";
import { SemiautomaticFlowReduxProvider } from "./SemiautomaticFlowReduxProvider";
import { LocaleProviderWrapper } from "./locale";

export const RootLayoutProvider: FC<TProvider> = ({ children }) => (
  <SemiautomaticFlowReduxProvider>
    <TanStackQueryClientProvider>
      <LocaleProviderWrapper>
        <ModalProvider>
          <FormContactProvider>{children}</FormContactProvider>
        </ModalProvider>
      </LocaleProviderWrapper>
    </TanStackQueryClientProvider>
  </SemiautomaticFlowReduxProvider>
);
