import React from 'react';
import { Spinner } from './Spinner';

export interface ButtonLoadingProps {
  loading: boolean;
  children: React.ReactNode;
}

export const ButtonLoading = ({ loading, children, ...props }: ButtonLoadingProps) => (
  <button
    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
    disabled={loading}
    {...props}
  >
    {loading ? <Spinner size="4" color="white" /> : children}
  </button>
);
