"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import type { FC } from "react";
import type { TProvider } from "@interfaces/provider";
import { makeStore } from "@store/semiautomaticFlow";
import type { AppStore } from "@store/semiautomaticFlow";

export const SemiautomaticFlowReduxProvider: FC<TProvider> = ({ children }) => {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
};

