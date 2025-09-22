import React from "react";
import { Eye, EyeOff } from "lucide-react";

export const TogglePasswordButton = ({ visible, setVisible, ariaLabel }) => {
  return (
    <button
      type="button"
      onClick={() => setVisible((prev) => !prev)}
      className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
      aria-label={ariaLabel}
    >
      {visible ? (
        <EyeOff data-testid="lucide-eye-off" size={20} />
      ) : (
        <Eye data-testid="lucide-eye" size={20} />
      )}
    </button>
  );
};
