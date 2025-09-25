import {
  ForgotPasswordRequest,
  LoginUserRequest,
  RegisterUserRequest,
  ResetPasswordRequest,
  RestoreSessionRequest,
} from '../auth/types';
import { supabase } from './supabaseClient';

// --- Register ---
export const register = async ({ email, password }: RegisterUserRequest) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

// --- Login ---
export const login = async ({ email, password }: LoginUserRequest) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  return data;
};

// --- Logout ---
export const logoutApi = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
};

// --- Restore session ---
export const restoreSupabaseSession = async ({ session }: RestoreSessionRequest) => {
  const { data, error } = await supabase.auth.setSession(session);
  if (error) throw error;

  return data;
};

// --- Forgot password ---
export const forgotPassword = async ({ email }: ForgotPasswordRequest) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
  return true;
};

// --- Reset password ---
export const resetPassword = async ({ password }: ResetPasswordRequest) => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return true;
};
