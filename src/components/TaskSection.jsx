import React from 'react';
import { TaskTable } from './TaskTable';
import { LoadingDots } from './LoadingDots';

export const TaskSection = ({ tasks, loading, onTaskCreated, onToggleCompletion }) => {
  if (loading) return <LoadingDots />;
  return (
    <TaskTable
      tasks={tasks}
      onTaskCreated={onTaskCreated}
      onToggleCompletion={onToggleCompletion}
    />
  );
};
