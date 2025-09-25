import React from 'react';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';

import { toast } from 'react-toastify';
import { logger } from '../utils/logger';
import { GlobalLoader } from './GlobalLoader';

const exponentialRetry = (failureCount: number) => (failureCount > 3 ? false : true);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: exponentialRetry,
      retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
    },
    mutations: {
      retry: exponentialRetry,
      retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000),
    },
  },
  queryCache: new QueryCache({
    onError: (err: unknown) => {
      toast.error((err as Error)?.message || 'An error occurred');
      logger.error('React Query Global Error', { err });
    },
    onSuccess: (data: unknown) => {
      const d = data as { toastSuccess?: string };
      if (d.toastSuccess) toast.success(d.toastSuccess);
    },
  }),
  mutationCache: new MutationCache({
    onError: (err: unknown) => {
      toast.error((err as Error)?.message || 'Mutation failed');
      logger.error('React Query Global Mutation Error', { err });
    },
    onSuccess: (data: unknown) => {
      const d = data as { toastSuccess?: string };
      if (d.toastSuccess) toast.success(d.toastSuccess);
      logger.info('Mutation Success', { data });
    },
  }),
});

export interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <GlobalLoader />
  </QueryClientProvider>
);
