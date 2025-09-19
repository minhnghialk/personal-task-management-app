import { formatDate } from "../utils/date";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { ChecklistView } from "./ChecklistView";

export const TaskRowDesktop = ({ task, onToggleCompletion }) => {
  return (
    <tr className="border-b">
      <td className="py-2 px-4 flex items-center gap-2">
        <input
          type="checkbox"
          className="w-4 h-4 accent-blue-500"
          checked={task.completed || false}
          onChange={(e) => onToggleCompletion(task.id, e.target.checked)}
        />
        <span className={task.completed ? "line-through text-gray-400" : ""}>
          {task.title}
        </span>
      </td>
      <td className="py-2 px-4">
        <TaskPriorityBadge priority={task.priority} />
      </td>
      <td className="py-2 px-4">{formatDate(task.deadline)}</td>
      <td className="py-2 px-4">
        <TaskStatusBadge status={task.status} />
      </td>
      <td className="py-2 px-4">
        <ChecklistView checklist={task.checklist} />
      </td>
      <td className="py-2 px-4 text-blue-600 cursor-pointer">Xem</td>
    </tr>
  );
};
