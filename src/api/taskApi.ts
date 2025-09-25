import { supabase } from './supabaseClient';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  done?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getTasks = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as Task[];
};

export const updateTask = async (taskId: string, updatedFields: Partial<Task>): Promise<void> => {
  const { error } = await supabase.from('tasks').update(updatedFields).eq('id', taskId);

  if (error) throw error;
};

export const createTask = async (
  task: Omit<Task, 'id' | 'created_at' | 'updated_at'>,
): Promise<Task> => {
  const { data, error } = await supabase.from('tasks').insert([task]).select().single();

  if (error) throw error;

  return data as Task;
};
