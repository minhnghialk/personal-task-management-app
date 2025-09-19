import React from "react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../api/supabaseClient";

export const useTasks = (user) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching tasks:", error.message);
    else setTasks(data || []);
    setLoading(false);
  }, [user]);

  const toggleTaskCompletion = useCallback(async (taskId, completed) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          if (completed) {
            return {
              ...t,
              completed: true,
              status: "done",
              prevStatus: t.status,
            };
          } else {
            return { ...t, completed: false, status: t.prevStatus || "todo" };
          }
        }
        return t;
      })
    );

    const { error } = await supabase
      .from("tasks")
      .update({
        completed,
        status: completed ? "done" : undefined,
      })
      .eq("id", taskId);

    if (error) console.error("Error updating task:", error.message);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, setTasks, toggleTaskCompletion };
};
