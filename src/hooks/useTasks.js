import { useState, useEffect, useCallback } from "react";
import { supabase } from "../api/supabaseClient";

export const useTasks = (user) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks từ Supabase
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const tasksWithPrev = (data || []).map((t) => ({
        ...t,
        prevStatus: t.status,
      }));

      setTasks(tasksWithPrev);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Toggle trạng thái hoàn thành
  const toggleTaskCompletion = useCallback(async (taskId, checked) => {
    let updatedTask;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newStatus = checked ? "done" : t.prevStatus || "todo";
          updatedTask = { ...t, status: newStatus, prevStatus: t.status };
          return updatedTask;
        }
        return t;
      })
    );

    if (!updatedTask) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: updatedTask.status })
        .eq("id", taskId);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating task:", err.message);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: updatedTask.prevStatus } : t
        )
      );
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, setTasks, toggleTaskCompletion, fetchTasks };
};
