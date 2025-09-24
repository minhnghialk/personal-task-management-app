import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Sidebar } from "../components/Sidebar";
import { MainHeader } from "../components/MainHeader";
import { supabase } from "../api/supabaseClient";
import { toast } from "react-toastify";
import { logoutUser } from "../auth/AuthSlice";

export const DashboardLayout = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(logoutUser());
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Không thể đăng xuất.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        <MainHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {/* Nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
