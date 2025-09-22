import React from "react";
import { TaskCardMobile } from "./TaskCardMobile";

export const TaskTableMobile = ({ tasks, onToggleCompletion }) => (
  <div className="block lg:hidden space-y-4">
    {tasks.length > 0 ? (
      tasks.map((task) => (
        <TaskCardMobile
          key={task.id}
          task={task}
          onToggleCompletion={onToggleCompletion}
        />
      ))
    ) : (
      <p className="text-gray-500 text-center py-6 italic">Chưa có task nào.</p>
    )}
  </div>
);
