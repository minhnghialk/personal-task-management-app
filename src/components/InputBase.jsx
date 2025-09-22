import React from "react";

export const InputBase = ({ error, className = "", ...props }) => {
  const baseClass =
    "w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <input
      className={`${baseClass} ${
        error ? "border-red-500" : "border-gray-300"
      } ${className}`}
      {...props}
    />
  );
};
