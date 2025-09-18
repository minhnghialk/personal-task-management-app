import { Menu } from "lucide-react";

export const MainHeader = ({ activeMenu, user, setSidebarOpen }) => (
  <header className="sticky top-0 z-30 flex items-center justify-between bg-white shadow px-4 py-3 md:rounded-b-2xl">
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
);
