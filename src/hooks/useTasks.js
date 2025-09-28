import { useState, useEffect, useCallback } from 'react';
import { getTasks, updateTask } from '../api/taskApi';
import { toast } from 'react-toastify';

export const useTasks = (user) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getTasks(user.id);
      setTasks(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateTaskField = useCallback(async (taskId, updatedFields) => {
    setTasks((prevTasks) => {
      const snapshot = prevTasks.find((t) => t.id === taskId);
      if (!snapshot) return prevTasks;

      const updatedTasks = prevTasks.map((t) => (t.id === taskId ? { ...t, ...updatedFields } : t));

      (async () => {
        try {
          await updateTask(taskId, updatedFields);
        } catch (err) {
          console.error(err);
          toast.error('Failed to update task');

          setTasks((current) => current.map((t) => (t.id === taskId ? snapshot : t)));
        }
      })();

      return updatedTasks;
    });
  }, []);

  const toggleTaskCompletion = useCallback(
    (taskId, checked) => {
      const newStatus = checked ? 'done' : 'todo';
      updateTaskField(taskId, { status: newStatus });
    },
    [updateTaskField],
  );

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  return {
    tasks,
    loading,
    setTasks,
    fetchTasks,
    updateTaskField,
    toggleTaskCompletion,
  };
};
