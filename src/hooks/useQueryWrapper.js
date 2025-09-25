import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { logger } from '../utils/logger';
import { toast } from 'react-toastify';
import { EmptyState } from '../components/EmptyState';
import PropTypes from 'prop-types';

// Query wrapper
export const useQueryWrapper = (key, fetchFn, options = {}) => {
  const query = useQuery(key, fetchFn, {
    ...options,
    retry: options.retry ?? 3,
    retryDelay: options.retryDelay ?? ((attempt) => Math.min(1000 * 2 ** attempt, 30000)),
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    onError: (err) => {
      logger.error('QueryWrapper Error', { key, err });
      toast.error(err.message || 'Something went wrong');
      options.onError?.(err);
    },
    onSuccess: (data) => {
      logger.info('QueryWrapper Success', { key, data });
      if (data?.toastSuccess) toast.success(data.toastSuccess);
      options.onSuccess?.(data);
    },
  });

  const RenderWrapper = ({ children, emptyMessage }) => {
    if (query.isLoading)
      return (
        <div className="flex justify-center items-center min-h-[150px]">
          <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
        </div>
      );

    if (query.isError)
      return (
        <div className="flex flex-col items-center justify-center min-h-[150px] p-4 bg-red-50 text-red-900 rounded-md">
          <h2 className="text-lg font-bold mb-2">Oops! Something went wrong.</h2>
          <p>{query.error?.message}</p>
          <button
            onClick={query.refetch}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      );

    if (!query.data || (Array.isArray(query.data) && query.data.length === 0))
      return <EmptyState message={emptyMessage} />;

    return children(query.data);
  };

  RenderWrapper.propTypes = {
    children: PropTypes.func.isRequired,
    emptyMessage: PropTypes.string,
  };

  return { ...query, RenderWrapper };
};

// Mutation wrapper
export const useMutationWrapper = (mutateFn, options = {}) => {
  return useMutation(mutateFn, {
    ...options,
    retry: options.retry ?? 1,
    retryDelay: options.retryDelay ?? ((attempt) => Math.min(1000 * 2 ** attempt, 30000)),
    onError: (err) => {
      logger.error('MutationWrapper Error', { err });
      toast.error(err.message || 'Mutation failed');
      options.onError?.(err);
    },
    onSuccess: (data) => {
      logger.info('MutationWrapper Success', { data });
      if (data?.toastSuccess) toast.success(data.toastSuccess);
      options.onSuccess?.(data);
    },
  });
};
