import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MainHeader } from '../components/MainHeader';
import { Sidebar } from '../components/Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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

export default DashboardLayout;
