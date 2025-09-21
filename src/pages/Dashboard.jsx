import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import { logout } from "../auth/authSlice";

import { Sidebar } from "../components/Sidebar";
import { MainHeader } from "../components/MainHeader";
import { TaskSection } from "../components/TaskSection";
import { StatsSection } from "../components/StatsSection";
import { ProfileSection } from "../components/ProfileSection";
import { TaskListSection } from "../components/TaskListSection";

import { MENUS } from "../utils/menus";

import { useTasks } from "../hooks/useTasks";
import { useSupabaseSession } from "../hooks/useSupabaseSession";
import { toast } from "react-toastify";

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
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Logout error:", error.message);
      toast.error("Không thể đăng xuất.");
    }
  };

  const MENU_COMPONENTS = {
    [MENUS.DASHBOARD]: (
      <>
        <TaskSection
          tasks={tasks}
          loading={loading}
          onTaskCreated={(newTask) => setTasks((prev) => [newTask, ...prev])}
          onToggleCompletion={toggleTaskCompletion}
        />
        <StatsSection />
      </>
    ),
    [MENUS.TASK_LIST]: <TaskListSection />,
    [MENUS.STATS]: <StatsSection />,
    [MENUS.PROFILE]: <ProfileSection />,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        handleLogout={handleLogout}
      />

      <div className="flex-1 lg:ml-64 flex flex-col">
        <MainHeader activeMenu={activeMenu} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {MENU_COMPONENTS[activeMenu]}
        </main>
      </div>
    </div>
  );
};
