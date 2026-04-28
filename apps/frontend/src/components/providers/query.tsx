"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { type FC } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { TProvider } from "@interfaces/provider";

export const TanStackQueryClientProvider: FC<TProvider> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 1
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default TanStackQueryClientProvider;
