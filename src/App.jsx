import React from "react";
import "./styles/tailwind.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegisterPage } from "./auth/RegisterPage";
import { LoginPage } from "./auth/LoginPage";
import { DashboardPage } from "./pages/Dashboard";
import { ForgotPasswordPage } from "./auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./auth/ResetPasswordPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Đăng ký */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Đăng nhập */}
          <Route path="/login" element={<LoginPage />} />

          {/* Quên mật khẩu */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Đặt lại mật khẩu */}
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
