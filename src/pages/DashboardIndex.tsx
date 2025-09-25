import React from 'react';
import { useAppSelector } from '../app/store';
import { StatsSection } from '../components/StatsSection';
import { TaskSection } from '../components/TaskSection';
import { useTasks } from '../hooks/useTasks';

const DashboardIndex = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { tasks, loading, setTasks, toggleTaskCompletion } = useTasks(user);

  return (
    <>
      <TaskSection
        tasks={tasks}
        loading={loading}
        onTaskCreated={(newTask) => setTasks((prev) => [newTask, ...prev])}
        onToggleCompletion={toggleTaskCompletion}
      />
      <StatsSection />
    </>
  );
};

export default DashboardIndex;
