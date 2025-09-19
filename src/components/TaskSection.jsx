import React from "react";
import { TaskTable } from "./TaskTable";
import { LoadingDots } from "./LoadingDots";

export const TaskSection = ({
  tasks,
  loading,
  user,
  onTaskCreated,
  onToggleCompletion,
}) => {
  if (loading) return <LoadingDots />;
  return (
    <TaskTable
      tasks={tasks}
      user={user}
      onTaskCreated={onTaskCreated}
      onToggleCompletion={onToggleCompletion}
    />
  );
};
