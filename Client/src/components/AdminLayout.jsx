import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './ui/AdminSideBar';
// import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-20 lg:w-64 flex-shrink-0">
        <AdminSidebar />
      </aside>
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;