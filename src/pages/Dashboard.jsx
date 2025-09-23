// src/pages/DashboardPage.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useTasks } from "../hooks/useTasks";
import { TaskSection } from "../components/TaskSection";
import { StatsSection } from "../components/StatsSection";

export const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);
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
