import React, { InputHTMLAttributes } from 'react';
import { useFormContext, FieldError, FieldValues, Path } from 'react-hook-form';

export interface InputBaseProps<T extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: Path<T>;
  className?: string;
}

export const InputBase = <T extends FieldValues>({
  name,
  className = '',
  ...props
}: InputBaseProps<T>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const fieldError = errors[name] as FieldError | undefined;

  const baseClass =
    'w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div>
      <input
        {...register(name)}
        className={`${baseClass} ${fieldError ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...props}
      />
      {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>}
    </div>
  );
};
