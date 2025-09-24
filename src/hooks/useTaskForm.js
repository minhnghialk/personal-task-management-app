import { useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createTask } from "../api/taskApi";
import { TaskPriority, TaskStatus } from "../utils/taskOptions";

export const useTaskForm = ({ onTaskCreated, onClose, addTaskToList }) => {
  const user = useSelector((state) => state.auth.user);

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      priority: TaskPriority.LOW,
      status: TaskStatus.TODO,
      checklist: [],
    },
  });

  const { control, handleSubmit, reset } = methods;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "checklist",
  });

  const onSubmit = async (data) => {
    try {
      const taskData = await createTask({ ...data, user_id: user?.id });
      if (addTaskToList) addTaskToList(taskData);
      if (onTaskCreated) onTaskCreated(taskData);
      reset();
      onClose();
      toast.success("Tạo task thành công!");
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error("Tạo task thất bại. Vui lòng thử lại!");
    }
  };

  const addChecklistItem = (text) => {
    if (text.trim()) append({ id: Date.now(), text, done: false });
  };

  const toggleChecklistItem = (index) => {
    const item = fields[index];
    update(index, { ...item, done: !item.done });
  };

  return {
    methods,
    fields,
    addChecklistItem,
    removeChecklistItem: remove,
    toggleChecklistItem,
    handleSubmitForm: handleSubmit(onSubmit),
  };
};
