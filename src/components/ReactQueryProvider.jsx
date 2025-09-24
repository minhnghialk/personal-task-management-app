import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logger } from "../utils/logger";
import { GlobalLoader } from "./GlobalLoader";

const exponentialRetry = (failureCount, error) =>
  failureCount > 3 ? false : true;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: exponentialRetry,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
      onError: (err) => {
        toast.error(err.message || "An error occurred");
        logger.error("React Query Error", { err });
      },
      onSuccess: (data) => {
        if (data?.toastSuccess) toast.success(data.toastSuccess);
      },
    },
    mutations: {
      retry: exponentialRetry,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      onError: (err) => {
        toast.error(err.message || "Mutation failed");
        logger.error("React Query Mutation Error", { err });
      },
      onSuccess: (data) => {
        logger.info("Mutation Success", { data });
        if (data?.toastSuccess) toast.success(data.toastSuccess);
      },
    },
  },
});

export const ReactQueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <GlobalLoader />
  </QueryClientProvider>
);
