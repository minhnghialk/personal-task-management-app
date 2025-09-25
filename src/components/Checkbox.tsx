import React, { InputHTMLAttributes } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<unknown>>;
}

export const Checkbox = ({ label, error, ...props }: CheckboxProps) => (
  <div className="flex flex-col">
    <label className="flex items-center gap-2 text-sm text-gray-600">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
        {...props}
      />
      {label}
    </label>
    {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
  </div>
);
