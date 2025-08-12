// app/components/reusable/Navbar.jsx
"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg border-b-4 border-[#4ECDC4] sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand Name */}
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-extrabold text-[#FF6B35] tracking-tight hover:text-[#4ECDC4] transition-colors duration-300">
              Community Hub
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/join-game">Join a Game</NavLink>
            <NavLink href="/tournaments">Tournaments</NavLink>
            <NavLink href="/fundraising">Fundraising</NavLink>
            <NavLink href="/blogs">Blogs</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FF6B35]">
              <span className="sr-only">Open main menu</span>
              <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink href="/" onClick={toggleMenu}>Home</MobileNavLink>
          <MobileNavLink href="/join-game" onClick={toggleMenu}>Join a Game</MobileNavLink>
          <MobileNavLink href="/tournaments" onClick={toggleMenu}>Tournaments</MobileNavLink>
          <MobileNavLink href="/fundraising" onClick={toggleMenu}>Fundraising</MobileNavLink>
          <MobileNavLink href="/blogs" onClick={toggleMenu}>Blogs</MobileNavLink>
        </div>
      </div>
    </nav>
  );
}

// Reusable component for desktop links
function NavLink({ href, children }) {
  return (
    <Link href={href} className="text-gray-900 hover:text-[#4ECDC4] px-3 py-2 text-md font-bold transition-colors duration-300 transform hover:scale-105">
      {children}
    </Link>
  );
}

// Reusable component for mobile links
function MobileNavLink({ href, children, onClick }) {
  return (
    <Link href={href} onClick={onClick} className="block text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium transition-colors duration-300">
      {children}
    </Link>
  );
}
