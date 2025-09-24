import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { restoreSession } from "./auth/AuthSlice";
import { restoreSupabaseSession } from "./api/authApi";

export const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await restoreSupabaseSession();
        await dispatch(restoreSession());
      } catch (err) {
        console.error("Restore session failed:", err);
      } finally {
        setInitializing(false);
      }
    })();
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
