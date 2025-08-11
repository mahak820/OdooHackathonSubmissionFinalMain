import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { NavbarDemo } from './components/Navbar';
import JellyCursor from './components/ui/JellyCursor';

const Layout = () => {
  const location = useLocation();
  
  // UPDATED: This now checks if the URL starts with "/owner" OR "/admin"
  const isSpecialSection = location.pathname.startsWith('/owner') || location.pathname.startsWith('/admin');

  return (
    <>
      {/* If it's NOT a special section, render the Navbar and Cursor */}
      {!isSpecialSection && (
        <>
          <NavbarDemo />
          <JellyCursor />
        </>
      )}
      
      {/* The Outlet will render the actual page component from your routes */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;