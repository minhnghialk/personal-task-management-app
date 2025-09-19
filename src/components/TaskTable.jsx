import { useState } from "react";
import { TaskForm } from "./TaskForm";
import { TaskTableHeader } from "./TaskTableHeader";
import { TaskTableMobile } from "./TaskTableMobile";
import { TaskTableDesktop } from "./TaskTableDesktop";
export const TaskTable = ({
  tasks,
  onTaskCreated,
  user,
  onToggleCompletion,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        {/* Header */} <TaskTableHeader onAdd={() => setModalOpen(true)} />
        {/* Mobile + Tablet */}{" "}
        <TaskTableMobile
          tasks={tasks}
          onToggleCompletion={onToggleCompletion}
        />
        {/* Desktop */}{" "}
        <TaskTableDesktop
          tasks={tasks}
          onToggleCompletion={onToggleCompletion}
        />
      </div>
      {/* Modal Form */}
      <TaskForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={user}
        onTaskCreated={onTaskCreated}
      />
    </>
  );
};
