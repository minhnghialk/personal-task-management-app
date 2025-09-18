import React from "react";
import { LogOut, X, Home, List, BarChart2, User } from "lucide-react";
import { PulseDot } from "./PulseDot";
import { menuItems } from "../utils/data";

const iconsMap = { Home, List, BarChart2, User };

export const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeMenu,
  setActiveMenu,
  user,
  handleLogout,
}) => (
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
            {React.createElement(iconsMap[item.iconName], {
              className: "w-5 h-5",
            })}
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
);
