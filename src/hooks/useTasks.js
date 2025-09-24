import { useState, useEffect, useCallback } from "react";
import { supabase } from "../api/supabaseClient";

export const useTasks = (user) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const toggleTaskCompletion = useCallback(async (taskId, checked) => {
    let prevStatus = null;
    let newStatus = checked ? "done" : "todo";

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          prevStatus = t.status;
          return { ...t, status: newStatus, prevStatus: t.status };
        }
        return t;
      })
    );

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating task:", err.message);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: prevStatus } : t))
      );
    }
  }, []);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  return { tasks, loading, setTasks, toggleTaskCompletion, fetchTasks };
};
