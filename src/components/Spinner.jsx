import React from "react";

export const Spinner = ({ size = "10" }) => {
  const sizeClass = {
    4: "w-4 h-4",
    5: "w-5 h-5",
    6: "w-6 h-6",
    8: "w-8 h-8",
    10: "w-10 h-10",
  }[size];

  return (
    <div
      data-testid="spinner"
      className={`animate-spin rounded-full border-2 border-t-blue-500 border-gray-200 ${sizeClass}`}
    ></div>
  );
};
