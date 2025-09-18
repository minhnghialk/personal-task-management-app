// import React from "react";
// import { useSelector } from "react-redux";
// import { Navigate, useLocation } from "react-router-dom";

// export const ProtectedRoute = ({ children }) => {
//   const { user } = useSelector((state) => state.auth);
//   const location = useLocation();

//   if (!user) {
//     // Nếu chưa login → redirect về /login-required và nhớ vị trí để sau này quay lại
//     return <Navigate to="/login-required" state={{ from: location }} replace />;
//   }

//   return children;
// };

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
