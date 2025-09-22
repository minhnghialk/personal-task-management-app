import React from "react";
import { useSelector } from "react-redux";
import { LoginRequiredPage } from "../auth/LoginRequiredPage";

export const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Nếu chưa login → hiển thị trang LoginRequiredPage
    return <LoginRequiredPage />;
  }

  return children;
};
