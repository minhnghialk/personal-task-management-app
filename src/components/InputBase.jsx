import React from "react";
import { useFormContext } from "react-hook-form";

export const InputBase = ({ name, className = "", ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const baseClass =
    "w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      <input
        {...register(name)}
        className={`${baseClass} ${
          errors[name] ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};
