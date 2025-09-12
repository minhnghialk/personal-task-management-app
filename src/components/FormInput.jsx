import React from "react";

const typeToAutocomplete = {
  email: "email",
  password: "new-password",
  text: "name",
};

export const FormInput = React.forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      name,
      error,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <label className="block">
        <span className="text-gray-700 text-sm font-medium">{label}</span>
        <div className="relative">
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref}
            autoComplete={typeToAutocomplete[type] || "off"}
            {...props}
            className={`mt-1 block w-full rounded-lg border border-gray-300 p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              className || ""
            }`}
          />
          {children}
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
      </label>
    );
  }
);
