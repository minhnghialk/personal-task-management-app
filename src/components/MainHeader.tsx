import React from 'react';
import { useAppSelector } from '../app/store';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { menuItems } from '../utils/data';

interface MainHeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export const MainHeader = ({ setSidebarOpen }: MainHeaderProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const { pathname } = useLocation();

  const title =
    [...menuItems]
      .sort((a, b) => b.path.length - a.path.length)
      .find((item) => pathname.startsWith(item.path))?.name || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white shadow px-4 py-3 md:rounded-b-2xl">
      <button
        className="p-2 bg-gray-800 text-white rounded-md lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{title}</h1>

      {user?.email && (
        <div className="flex items-center gap-2 sm:gap-4">
          <div
            data-testid="header-user-initial"
            className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold"
          >
            {user.email[0].toUpperCase()}
          </div>
          <span
            data-testid="header-user-email"
            className="hidden sm:inline text-gray-900 font-medium"
          >
            {user.email}
          </span>
        </div>
      )}
    </header>
  );
};
