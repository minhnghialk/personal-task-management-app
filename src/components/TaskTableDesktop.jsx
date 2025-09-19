import { TaskRowDesktop } from "./TaskRowDesktop";

export const TaskTableDesktop = ({ tasks, onToggleCompletion }) => (
  <div className="hidden lg:block overflow-x-auto">
    <table className="min-w-full text-sm text-left text-gray-600">
      <thead className="border-b">
        <tr>
          <th className="py-2 px-4">Tên</th>
          <th className="py-2 px-4">Ưu tiên</th>
          <th className="py-2 px-4">Deadline</th>
          <th className="py-2 px-4">Trạng thái</th>
          <th className="py-2 px-4">Checklist</th>
          <th className="py-2 px-4">Xem</th>
        </tr>
      </thead>
      <tbody>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskRowDesktop
              key={task.id}
              task={task}
              onToggleCompletion={onToggleCompletion}
            />
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center text-gray-500 py-6 italic">
              Chưa có task nào.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
