import React from "react";
import { useFormContext } from "react-hook-form";

export const SelectField = ({ name, options, className = "", ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const baseClass =
    "w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      <select
        {...register(name)}
        className={`${baseClass} ${
          errors[name] ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};
