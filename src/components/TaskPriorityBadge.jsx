import React from "react";

export const TaskPriorityBadge = ({ priority }) => {
  const styles =
    priority === "high"
      ? "bg-red-100 text-red-700"
      : priority === "medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  const label =
    priority === "high" ? "Cao" : priority === "medium" ? "Trung bình" : "Thấp";

  return (
    <span
      className={`inline-block px-2 py-1 rounded-full font-semibold text-xs sm:text-sm ${styles}`}
    >
      {label}
    </span>
  );
};
