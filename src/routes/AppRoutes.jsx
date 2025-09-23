// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { RegisterPage } from "../auth/RegisterPage";
import { LoginPage } from "../auth/LoginPage";
import { ForgotPasswordPage } from "../auth/ForgotPasswordPage";
import { ResetPasswordPage } from "../auth/ResetPasswordPage";
import { DashboardLayout } from "../pages/DashboardLayout";
import { DashboardPage } from "../pages/Dashboard";
import { TaskListSection } from "../components/TaskListSection";
import { StatsSection } from "../components/StatsSection";
import { ProfileSection } from "../components/ProfileSection";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected nested routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="tasks" element={<TaskListSection />} />
        <Route path="stats" element={<StatsSection />} />
        <Route path="profile" element={<ProfileSection />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
