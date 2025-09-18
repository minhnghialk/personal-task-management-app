import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { supabase } from "../api/supabaseClient"; // import supabase client

export const TaskForm = ({ isOpen, onClose, user }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Tên task bắt buộc.";
    if (!deadline) errs.deadline = "Deadline bắt buộc.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddChecklistItem = () => {
    if (newItem.trim()) {
      setChecklist([
        ...checklist,
        { id: Date.now(), text: newItem, done: false },
      ]);
      setNewItem("");
    }
  };

  const handleRemoveChecklistItem = (id) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const handleToggleChecklist = (id) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      // 1. Insert task vào Supabase
      const { data: taskData, error: taskError } = await supabase
        .from("tasks")
        .insert([
          {
            name,
            description,
            deadline,
            priority,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (taskError) throw taskError;

      const taskId = taskData.id;

      // 2. Insert checklist items (nếu có)
      if (checklist.length > 0) {
        const checklistItems = checklist.map((item) => ({
          task_id: taskId,
          text: item.text,
          done: item.done,
        }));

        const { error: checklistError } = await supabase
          .from("checklist_items")
          .insert(checklistItems);

        if (checklistError) throw checklistError;
      }

      // Reset form
      setName("");
      setDescription("");
      setDeadline("");
      setPriority("Medium");
      setChecklist([]);
      setNewItem("");
      setErrors({});

      onClose();
      alert("Task đã được tạo thành công!");
    } catch (error) {
      console.error("Error creating task:", error.message);
      alert("Tạo task thất bại: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(144, 149, 161, 0.3)" }}
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-full">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900">Tạo mới Task</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Tên Task</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border rounded-md p-2 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên task"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 resize-none"
              rows={3}
              placeholder="Mô tả chi tiết công việc"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={`w-full border rounded-md p-2 ${
                errors.deadline ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.deadline && (
              <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1">Ưu tiên</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Checklist */}
          <div>
            <label className="block text-sm font-medium mb-1">Checklist</label>
            <div className="flex flex-col gap-2 mb-2 max-h-40 overflow-y-auto">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleToggleChecklist(item.id)}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span
                      className={item.done ? "line-through text-gray-400" : ""}
                    >
                      {item.text}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md p-2"
                placeholder="Thêm checklist mới"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="bg-gray-900 hover:bg-black text-white rounded-md px-4 flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Đang tạo..." : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
