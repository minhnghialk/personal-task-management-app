import React from 'react';
import { useFormContext } from 'react-hook-form';

export const TextareaBase = ({ name, rows = 4, className = '', ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <textarea
        {...register(name)}
        rows={rows}
        className={`w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>}
    </div>
  );
};
