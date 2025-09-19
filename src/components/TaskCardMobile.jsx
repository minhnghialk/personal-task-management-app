import { formatDate } from "../utils/date";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { ChecklistView } from "./ChecklistView";

export const TaskCardMobile = ({ task, onToggleCompletion }) => {
  return (
    <div className="border rounded-2xl p-4 shadow hover:shadow-md transition bg-white">
      {/* Title + Checkbox */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          className="w-5 h-5 accent-blue-500"
          checked={task.status === "done"}
          onChange={(e) => onToggleCompletion(task.id, e.target.checked)}
        />
        <span
          className={`font-semibold text-gray-900 text-lg ${
            task.status === "done" ? "line-through text-gray-400" : ""
          }`}
        >
          {task.title}
        </span>
      </div>

      {/* Priority */}
      <div className="flex justify-between items-center text-sm font-medium mt-1">
        <span className="text-gray-500">Ưu tiên:</span>
        <TaskPriorityBadge priority={task.priority} />
      </div>

      {/* Deadline */}
      <div className="flex justify-between items-center text-sm font-medium mt-1">
        <span className="text-gray-500">Deadline:</span>
        <span className="text-gray-800">{formatDate(task.deadline)}</span>
      </div>

      {/* Status */}
      <div className="flex justify-between items-center text-sm font-medium mt-1">
        <span className="text-gray-500">Trạng thái:</span>
        <TaskStatusBadge status={task.status} />
      </div>

      {/* Checklist */}
      {task.checklist && task.checklist.length > 0 && (
        <div className="mt-3">
          <p className="text-gray-500 text-sm font-medium mb-1">Checklist:</p>
          <ChecklistView checklist={task.checklist} />
        </div>
      )}

      {/* Action button */}
      <div className="mt-3 flex justify-end">
        <button className="text-blue-600 text-sm font-semibold hover:underline">
          Xem
        </button>
      </div>
    </div>
  );
};
