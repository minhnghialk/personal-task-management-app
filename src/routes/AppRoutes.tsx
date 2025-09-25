import { useAppSelector } from '../app/store';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import NotFoundPage from '../pages/NotFoundPage';
import { AppInitializer } from '../AppInitializer';
import { GlobalLoader } from '../components/GlobalLoader';

// Pages
const LoginPage = lazy(() => import('../auth/LoginPage'));
const RegisterPage = lazy(() => import('../auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../auth/ResetPasswordPage'));
const DashboardLayout = lazy(() => import('../pages/DashboardLayout'));
const DashboardIndex = lazy(() => import('../pages/DashboardIndex'));
const DashboardTaskList = lazy(() => import('../pages/DashboardTaskList'));
const DashboardStats = lazy(() => import('../pages/DashboardStats'));
const DashboardProfile = lazy(() => import('../pages/DashboardProfile'));

export const AppRoutes = () => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <BrowserRouter>
      <Suspense fallback={<GlobalLoader />}>
        <AppInitializer>
          <Routes>
            <Route path="/" element={<ProtectedRoute isAllowed={!!user} />}>
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardIndex />} />
                <Route path="tasks" element={<DashboardTaskList />} />
                <Route path="stats" element={<DashboardStats />} />
                <Route path="profile" element={<DashboardProfile />} />
              </Route>
            </Route>

            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />

            {/* Fallback 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppInitializer>
      </Suspense>
    </BrowserRouter>
  );
};
