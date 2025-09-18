import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { restoreSession } from "./auth/authSlice";

export const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    dispatch(restoreSession());
    setInitializing(false);
  }, [dispatch]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Đang kiểm tra đăng nhập...</p>
      </div>
    );
  }

  return children;
};
