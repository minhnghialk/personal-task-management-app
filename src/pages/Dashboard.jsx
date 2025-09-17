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

export const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Hardcode Task data
  const tasks = [
    { id: 1, name: "Quan trọng", priority: "Cao", deadline: "20/04/2024" },
    { id: 2, name: "Ít quan trọng", priority: "Cao", deadline: "21/04/2024" },
    { id: 3, name: "Quan trọng", priority: "Thấp", deadline: "22/04/2024" },
    { id: 4, name: "Ít quan trọng", priority: "Thấp", deadline: "24/04/2024" },
    { id: 5, name: "Trễ hạn", priority: "Thấp", deadline: "24/04/2024" },
  ];

  const stats = {
    total: 10,
    done: 3,
    inProgress: 5,
    overdue: 2,
  };

  const chartData = [
    { name: "Đã hoàn thành", value: stats.done },
    { name: "Đang làm", value: stats.inProgress },
    { name: "Trễ hạn", value: stats.overdue },
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];

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

  // Menu items
  const menuItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Danh sách Task", icon: <List className="w-5 h-5" /> },
    { name: "Thống kê", icon: <BarChart2 className="w-5 h-5" /> },
    { name: "Hồ sơ cá nhân", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg flex flex-col justify-between transition-transform transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 z-40`}
      >
        <div>
          {/* Logo + Close button */}
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <PulseDot /> TickUp
            </div>
            <button
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col space-y-2 px-6">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenu(item.name);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition w-full text-left
                  ${
                    activeMenu === item.name
                      ? "bg-gray-700 font-semibold"
                      : "hover:bg-gray-700"
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-4 hover:bg-gray-700 transition w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white shadow px-4 py-3 md:rounded-b-2xl">
          {/* Mobile menu button */}
          <button
            className="p-2 bg-gray-800 text-white rounded-md md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
            {activeMenu}
          </h1>

          {user && (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                {user.email[0].toUpperCase()}
              </div>
              <span className="hidden sm:inline text-gray-900 font-medium">
                {user.email}
              </span>
            </div>
          )}
        </header>

        {/* Main Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {activeMenu === "Danh sách Task" && (
            <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Danh sách Task
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 hover:bg-black text-white font-semibold transition">
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Thêm Task</span>
                </button>
              </div>
              <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="border-b">
                  <tr>
                    <th className="py-2 px-4">Tên</th>
                    <th className="py-2 px-4">Ưu tiên</th>
                    <th className="py-2 px-4">Deadline</th>
                    <th className="py-2 px-4">Xem</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b">
                      <td className="py-2 px-4 flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-blue-500"
                        />
                        {task.name}
                      </td>
                      <td
                        className={`py-2 px-4 font-medium ${
                          task.priority === "Cao"
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {task.priority}
                      </td>
                      <td className="py-2 px-4">{task.deadline}</td>
                      <td className="py-2 px-4 text-blue-600 cursor-pointer">
                        Xem
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeMenu === "Thống kê" && (
            <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stats Table */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Dashboard thống kê nhanh
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>Tổng số Task</div>
                  <div>{stats.total}</div>
                  <div>Đã hoàn thành</div>
                  <div>{stats.done}</div>
                  <div>Đang làm</div>
                  <div>{stats.inProgress}</div>
                  <div>Trễ hạn</div>
                  <div>{stats.overdue}</div>
                </div>
              </div>

              {/* Pie Chart + Legend */}
              <div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Custom Legend */}
                <div className="mt-4 flex flex-col gap-2 text-sm">
                  {chartData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-gray-700">
                        {entry.name}:{" "}
                        <span className="font-semibold">{entry.value}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

          {activeMenu === "Dashboard" && (
            <div className="space-y-6">
              {/* Task List Preview */}
              <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Danh sách Task
                  </h2>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 hover:bg-black text-white font-semibold transition">
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Thêm Task</span>
                  </button>
                </div>
                <table className="min-w-full text-sm text-left text-gray-600">
                  <thead className="border-b">
                    <tr>
                      <th className="py-2 px-4">Tên</th>
                      <th className="py-2 px-4">Ưu tiên</th>
                      <th className="py-2 px-4">Deadline</th>
                      <th className="py-2 px-4">Xem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} className="border-b">
                        <td className="py-2 px-4 flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-blue-500"
                          />
                          {task.name}
                        </td>
                        <td
                          className={`py-2 px-4 font-medium ${
                            task.priority === "Cao"
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {task.priority}
                        </td>
                        <td className="py-2 px-4">{task.deadline}</td>
                        <td className="py-2 px-4 text-blue-600 cursor-pointer">
                          Xem
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Stats Preview */}
              <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Dashboard thống kê nhanh
                  </h2>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <div>Tổng số Task</div>
                    <div>{stats.total}</div>
                    <div>Đã hoàn thành</div>
                    <div>{stats.done}</div>
                    <div>Đang làm</div>
                    <div>{stats.inProgress}</div>
                    <div>Trễ hạn</div>
                    <div>{stats.overdue}</div>
                  </div>
                </div>

                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Custom Legend */}
                  <div className="mt-3 flex flex-col gap-1 text-sm">
                    {chartData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-gray-700">
                          {entry.name}:{" "}
                          <span className="font-semibold">{entry.value}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
