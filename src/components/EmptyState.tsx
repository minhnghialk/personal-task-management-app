import React from 'react';

export interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'No data available.' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[150px] p-6 text-gray-500">
      <svg
        className="w-16 h-16 mb-4 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-6h6v6m-6 0V9h6v8m0 0h6V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-6h-6"
        />
      </svg>
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
