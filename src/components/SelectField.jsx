import React from "react";

export const SelectField = ({ id, value, onChange, options, error }) => {
  const baseClass =
    "w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${baseClass} ${error ? "border-red-500" : "border-gray-300"}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
