import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, Users, Settings, LogOut } from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label }) => (
  <div className="relative group">
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <Icon size={20} />
      <span className="font-semibold hidden lg:block">{label}</span>
    </NavLink>
    <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none lg:hidden whitespace-nowrap">
      {label}
    </div>
  </div>
);

const AdminSidebar = () => {
  return (
    <div className="bg-white h-screen flex flex-col p-4 sticky top-0 border-r border-gray-200">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 hidden lg:block">Admin Panel</span>
      </div>

      <nav className="flex flex-col gap-2">
        <SidebarLink to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <SidebarLink to="/admin/approvals" icon={ShieldCheck} label="Facility Approvals" />
        <SidebarLink to="/admin/users" icon={Users} label="User Management" />
      </nav>

      <div className="mt-auto">
        <SidebarLink to="/admin/settings" icon={Settings} label="Settings" />
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 mt-2">
          <LogOut size={20} />
          <span className="font-semibold hidden lg:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;