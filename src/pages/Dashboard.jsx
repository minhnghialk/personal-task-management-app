import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../api/supabaseClient";
import { loginUser, logout } from "../auth/authSlice";
import { LogOut } from "lucide-react";

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Khôi phục session từ localStorage/sessionStorage
  useEffect(() => {
    const savedSession =
      JSON.parse(localStorage.getItem("supabaseSession")) ||
      JSON.parse(sessionStorage.getItem("supabaseSession"));

    if (savedSession) {
      supabase.auth.setSession(savedSession);
      if (savedSession.user) {
        dispatch({
          type: loginUser.fulfilled.type,
          payload: savedSession.user,
        });
      }
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <div className="text-gray-800 text-md sm:text-md font-semibold">
          {user ? (
            <>
              Xin chào, <span className="font-bold">{user.email}</span>
            </>
          ) : (
            "Vui lòng đăng nhập để tiếp tục."
          )}
        </div>

        {/* Nút đăng xuất */}
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl 
               text-gray-700 hover:text-gray-900 
               hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            title="Đăng xuất"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Dashboard
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Đây là nội dung trang Dashboard.
          </p>
        </div>
      </main>
    </div>
  );
};
