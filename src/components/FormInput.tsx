import React from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

const typeToAutocomplete = {
  email: 'email',
  password: 'new-password',
  text: 'name',
};

export interface FormInputProps {
  label: string;
  type: string;
  placeholder: string;
  name: string;
  error: FieldError | Merge<FieldError, FieldErrorsImpl<unknown>>;
  children?: React.ReactNode;
  className?: string;
}

export const FormInput = ({
  label,
  type = 'text',
  placeholder,
  name,
  error,
  children,
  className,
  ...props
}: FormInputProps) => {
  return (
    <label className="block">
      {label && <span className="text-gray-700 text-sm font-medium">{label}</span>}
      <div className="relative">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          autoComplete={typeToAutocomplete[type] || 'off'}
          {...props}
          className={`mt-1 block w-full rounded-lg border border-gray-300 p-2 pl-10 pr-3 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            className || ''
          }`}
        />
        {children}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </label>
  );
};
