import React from 'react';

export interface LoadingFallbackProps {
  routeName: string;
}

export const LoadingFallback = ({ routeName }: LoadingFallbackProps) => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-gray-600 text-lg">
      {routeName ? `Đang tải ${routeName}...` : 'Đang tải...'}
    </p>
  </div>
);
