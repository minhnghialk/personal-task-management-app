import React from "react";

export const FormField = ({ label, error, children }) => {
  const id = `${label.replace(/\s+/g, "-").toLowerCase()}-field`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children, { id })
        : children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
