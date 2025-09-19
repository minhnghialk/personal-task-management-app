import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import { logout } from "../auth/authSlice";

import { Sidebar } from "../components/Sidebar";
import { MainHeader } from "../components/MainHeader";
import { TaskSection } from "../components/TaskSection";
import { StatsCard } from "../components/StatsCard";

import { stats, chartData, COLORS } from "../utils/data";
import { useTasks } from "../hooks/useTasks";
import { useSupabaseSession } from "../hooks/useSupabaseSession";
import { toast } from "react-toastify";

const MENUS = {
  DASHBOARD: "Dashboard",
  TASK_LIST: "Danh sách Task",
  STATS: "Thống kê",
  PROFILE: "Hồ sơ cá nhân",
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(MENUS.DASHBOARD);

  const { tasks, loading, setTasks, toggleTaskCompletion } = useTasks(user);
  useSupabaseSession();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
      toast.error("Không thể đăng xuất.");
    }
  };

  const showTasks = [MENUS.DASHBOARD, MENUS.TASK_LIST].includes(activeMenu);
  const showStats =
    activeMenu === MENUS.DASHBOARD || activeMenu === MENUS.STATS;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        user={user}
        handleLogout={handleLogout}
      />

      <div className="flex-1 lg:ml-64 flex flex-col">
        <MainHeader
          activeMenu={activeMenu}
          user={user}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {showTasks && (
            <TaskSection
              tasks={tasks}
              loading={loading}
              user={user}
              onTaskCreated={(newTask) =>
                setTasks((prev) => [newTask, ...prev])
              }
              onToggleCompletion={toggleTaskCompletion}
            />
          )}

          {showStats && (
            <StatsCard stats={stats} chartData={chartData} COLORS={COLORS} />
          )}

          {activeMenu === MENUS.PROFILE && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Hồ sơ cá nhân
              </h2>
              <p className="text-gray-700 text-sm">
                Đây là màn hình hồ sơ cá nhân chi tiết.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
