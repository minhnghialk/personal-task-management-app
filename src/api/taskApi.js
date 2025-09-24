// src/api/taskApi.js
import { supabase } from "./supabaseClient";

export const getTasks = async (userId) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const updateTask = async (taskId, updatedFields) => {
  const { error } = await supabase
    .from("tasks")
    .update(updatedFields)
    .eq("id", taskId);
  if (error) throw error;
};

export const createTask = async (task) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert([task])
    .select()
    .single();
  if (error) throw error;
  return data;
};
