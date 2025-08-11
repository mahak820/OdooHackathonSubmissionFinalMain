"use client";
import { FiSend } from "react-icons/fi";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/Resizable_Navbar";
import { useEffect, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../Firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, signInUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export function NavbarDemo() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [dispatch, user, navigate]);

  const navItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Page1", link: "/page1" },
    { name: "Page2", link: "/Page2" },
    { name: "Contact", link: "#contact" },
  ];

  const landingNavItems = [
    { name: "Features", link: "#features" },
    { name: "About", link: "#about" },
    { name: "Footer", link: "#footer" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGoogleLogin = async () => {
    const response = await signInWithPopup(auth, provider);
    const user = response.user;
    const formData = {
      name: user.displayName,
      email: user.email,
    };
    dispatch(signInUser(formData));
  };

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logoutUser());
    navigate("/");
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={user ? navItems : landingNavItems} />
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <button
                  onClick={handleNavigateToLogin}
                  className="login-btn relative overflow-hidden uppercase no-underline border-2 border-[#FF6B35] px-5 py-2 text-[17px] text-[#FF6B35] font-bold bg-transparent transition-colors duration-300 hover:text-white rounded-2xl shadow-lg hover:shadow-[#FF6B35]/40 transform hover:scale-105 group cursor-pointer"
                >
                  <span className="relative z-10">Login</span>
                  {/* Filling animation pseudo-element */}
                  <span className="absolute inset-0 bg-[#FF6B35] transform scale-y-0 origin-bottom transition-transform duration-500 group-hover:scale-y-100 z-0 rounded-2xl"></span>
                </button>
           
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="logout-btn relative overflow-hidden uppercase no-underline border-2 border-red-700 px-5 py-2 text-[17px] text-red-500 font-bold bg-transparent transition-colors duration-300 hover:text-white rounded-2xl shadow-lg hover:shadow-red-700/50 transform hover:scale-105 group cursor-pointer"
              >
                <span className="relative z-10">Logout</span>
                {/* Filling animation pseudo-element */}
                <span className="absolute inset-0 bg-red-700 transform scale-y-0 origin-bottom transition-transform duration-500 group-hover:scale-y-100 z-0 rounded-2xl"></span>
              </button>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen}>
            {(user ? navItems : landingNavItems).map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block py-2">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 pt-4 border-t border-neutral-200">
              {!user ? (
                <>
                  <NavbarButton
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleNavigateToLogin();
                    }}
                    variant="primary"
                    className="w-full"
                  >
                    Login
                  </NavbarButton>
             
                </>
              ) : (
                <NavbarButton
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  variant="primary"
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Logout
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}