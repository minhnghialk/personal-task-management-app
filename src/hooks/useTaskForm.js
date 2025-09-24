import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createTask } from "../api/taskApi";

export const useTaskForm = ({ onTaskCreated, onClose, addTaskToList }) => {
  const user = useSelector((state) => state.auth.user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("low");
  const [status, setStatus] = useState("todo");
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Tiêu đề task bắt buộc.";
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

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setPriority("low");
    setStatus("todo");
    setChecklist([]);
    setNewItem("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const taskData = await createTask({
        title,
        description,
        deadline,
        priority,
        status,
        checklist,
        user_id: user?.id,
      });

      if (addTaskToList) addTaskToList(taskData);

      resetForm();
      if (onTaskCreated) onTaskCreated(taskData);
      toast.success("Tạo task thành công!");
      onClose();
    } catch (err) {
      console.error("Error creating task:", err.message);
      toast.error("Tạo task thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    deadline,
    setDeadline,
    priority,
    setPriority,
    status,
    setStatus,
    checklist,
    newItem,
    setNewItem,
    errors,
    loading,
    handleAddChecklistItem,
    handleRemoveChecklistItem,
    handleToggleChecklist,
    handleSubmit,
  };
};
