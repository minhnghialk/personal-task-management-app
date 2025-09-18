import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskForm } from "./TaskForm";

export const TaskTable = ({ tasks, onAddTask }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateTask = (newTask) => {
    onAddTask(newTask);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Danh sách Task</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 hover:bg-black text-white font-semibold transition"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Thêm Task</span>
          </button>
        </div>
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="border-b">
            <tr>
              <th className="py-2 px-4">Tên</th>
              <th className="py-2 px-4">Ưu tiên</th>
              <th className="py-2 px-4">Deadline</th>
              <th className="py-2 px-4">Xem</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="py-2 px-4 flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 accent-blue-500" />
                  {task.name}
                </td>
                <td
                  className={`py-2 px-4 font-medium ${
                    task.priority === "Cao" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {task.priority}
                </td>
                <td className="py-2 px-4">{task.deadline}</td>
                <td className="py-2 px-4 text-blue-600 cursor-pointer">Xem</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <TaskForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </>
  );
};
