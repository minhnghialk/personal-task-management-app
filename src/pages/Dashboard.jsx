import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../api/supabaseClient";
import { loginUser, logout } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  List,
  BarChart2,
  User,
  Menu,
  Plus,
  X,
} from "lucide-react";
import { PulseDot } from "../components/PulseDot";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { Sidebar } from "../components/Sidebar";
import { MainHeader } from "../components/MainHeader";
import { TaskTable } from "../components/TaskTable";
import { StatsCard } from "../components/StatsCard";

import { tasks, stats, chartData, COLORS } from "../utils/data";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Khôi phục session
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
    navigate("/login");
  };

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

      <div className="flex-1 md:ml-64 flex flex-col">
        <MainHeader
          activeMenu={activeMenu}
          user={user}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {activeMenu === "Dashboard" && (
            <>
              {/* Task List Preview */}
              <TaskTable tasks={tasks} />

              {/* Stats + Pie Chart */}
              <StatsCard stats={stats} chartData={chartData} COLORS={COLORS} />
            </>
          )}

          {activeMenu === "Danh sách Task" && <TaskTable tasks={tasks} />}

          {activeMenu === "Thống kê" && (
            <StatsCard stats={stats} chartData={chartData} COLORS={COLORS} />
          )}

          {activeMenu === "Hồ sơ cá nhân" && (
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
