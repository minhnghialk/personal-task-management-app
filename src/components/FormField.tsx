import React, { ReactElement } from 'react';

export interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactElement<{ id?: string }> | React.ReactNode;
}

export const FormField = ({ label, error, children }: FormFieldProps) => {
  const id = `${label.replace(/\s+/g, '-').toLowerCase()}-field`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children as ReactElement<{ id?: string }>)
        : children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
