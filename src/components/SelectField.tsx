import { useFormContext, FieldError } from 'react-hook-form';
import React from 'react';

type Option = {
  value: string | number;
  label: string;
};

type SelectFieldProps = {
  name: string;
  options: Option[];
  className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const SelectField = ({ name, options, className = '', ...props }: SelectFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const baseClass =
    'w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500';

  const fieldError = errors[name] as FieldError | undefined;

  return (
    <div>
      <select
        {...register(name)}
        className={`${baseClass} ${fieldError ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>}
    </div>
  );
};
