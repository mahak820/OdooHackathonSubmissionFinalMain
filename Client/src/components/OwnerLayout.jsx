import React from 'react';
import { Outlet } from 'react-router-dom';
import OwnerSidebar from './OwnerSidebar';

const OwnerLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-20 lg:w-64 flex-shrink-0">
        <OwnerSidebar />
      </aside>
      <main className="flex-grow">
        {/* The Outlet component renders the matched child route */}
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerLayout;