import { useAppDispatch, useAppSelector } from '../app/store';
import { logoutUser } from '../auth/actions/logout';
import { BarChart2, Home, List, LogOut, User, X } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { menuItems } from '../utils/data';
import { PulseDot } from './PulseDot';

const iconsMap = { Home, List, BarChart2, User };

export interface SidebarProps {
  sidebarOpen: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ sidebarOpen, onClose }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (authState.error) {
    toast.error('Không thể đăng xuất.');
  } else {
    if (authState.user === null) toast.success('Đăng xuất thành công');
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg flex flex-col justify-between transition-transform transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 z-40`}
    >
      <div>
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <PulseDot /> TickUp
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => onClose?.()}
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col space-y-2 px-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition w-full text-left ${
                  isActive ? 'bg-gray-700 font-semibold' : 'hover:bg-gray-700'
                }`
              }
              onClick={() => onClose?.()}
            >
              {React.createElement(iconsMap[item.iconName], {
                className: 'w-5 h-5',
              })}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {authState.user && (
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
};
