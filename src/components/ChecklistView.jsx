import React from "react";

export const ChecklistView = ({ checklist }) => {
  if (!checklist || checklist.length === 0) {
    return <span className="text-gray-400 italic">Không có</span>;
  }

  return (
    <ul className="list-disc list-inside text-sm text-gray-800 max-h-24 overflow-y-auto flex flex-col gap-1">
      {checklist.map((item) => (
        <li
          key={item.id}
          className={item.done ? "line-through text-gray-400" : ""}
        >
          {item.text}
        </li>
      ))}
    </ul>
  );
};
