import React from "react";
import { Plus } from "lucide-react";

export const TaskTableHeader = ({ onAdd }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-gray-900">Danh sách Task</h2>
    <button
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 hover:bg-black text-white font-semibold transition"
      onClick={onAdd}
    >
      <Plus className="w-5 h-5" />
      <span className="hidden sm:inline">Thêm Task</span>
    </button>
  </div>
);
