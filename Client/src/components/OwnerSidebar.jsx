import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, ShieldCheck, Calendar, LogOut, Settings } from 'lucide-react';
import { logoutUser } from '../features/auth/authSlice';
// import { logoutUser } from '../../features/auth/authSlice'; // Adjust the import path to your authSlice

const SidebarLink = ({ to, icon: Icon, label }) => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-green-600 text-white shadow-md'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="relative group">
      <NavLink to={to} className={navLinkClasses}>
        <Icon size={20} />
        <span className="font-semibold hidden lg:block">{label}</span>
      </NavLink>
      {/* Tooltip for collapsed view */}
      <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none lg:hidden whitespace-nowrap">
        {label}
      </div>
    </div>
  );
};

const OwnerSidebar = () => {
  // --- DYNAMIC DATA & LOGOUT FUNCTIONALITY ---
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    // After logout, redirect the user to the login or home page
    navigate('/login');
  };

  return (
    <div className="bg-white text-gray-800 h-screen flex flex-col p-4 sticky top-0 border-r border-gray-200">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-green-600 p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 hidden lg:block">Owner Panel</span>
      </div>

      <nav className="flex flex-col gap-2">
        <SidebarLink to="/owner/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <SidebarLink to="/owner/facilities" icon={ShieldCheck} label="My Facilities" />
        <SidebarLink to="/owner/bookings" icon={Calendar} label="Bookings" />
      </nav>

      <div className="mt-auto">
        <SidebarLink to="/owner/settings" icon={Settings} label="Settings" />
        
        <div className="border-t my-4"></div>

        {/* User Profile Section - Now uses dynamic data from Redux */}
        {user ? (
          <div className="flex items-center gap-3 p-2">
            <img 
              src={user.profilePhoto || 'https://placehold.co/100x100/green/white?text=A'} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="hidden lg:block">
              <p className="font-semibold text-sm text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">Facility Owner</p>
            </div>
          </div>
        ) : (
          <div className="p-2 h-[52px]"> {/* Placeholder for when user is loading */}
             <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        )}

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 mt-2"
        >
          <LogOut size={20} />
          <span className="font-semibold hidden lg:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default OwnerSidebar;