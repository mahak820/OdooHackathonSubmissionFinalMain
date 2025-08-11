"use client";
import { FiSend } from "react-icons/fi";
import { FaUser } from "react-icons/fa"; // Import profile icon
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

  // useEffect(() => {
  //   if (user) {
  //     navigate("/");
  //   }
  // }, [dispatch, user, navigate]);

  const navItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Page1", link: "/page1" },
    { name: "Page2", link: "/Page2" },
    { name: "Contact", link: "#contact" },
  ];

  // No navigation items regardless of user state
  const displayNavItems = [];

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

  const handleProfileClick = () => {
    // Add your profile navigation logic here
    navigate("/profile");
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={displayNavItems} />
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
              <>
                {/* Profile Icon Button */}
                <button
                  onClick={handleProfileClick}
                  className="profile-btn relative overflow-hidden border-2 border-[#4ECDC4] p-3 text-[#4ECDC4] font-bold bg-transparent transition-colors duration-300 hover:text-white rounded-full shadow-lg hover:shadow-[#4ECDC4]/40 transform hover:scale-105 group cursor-pointer"
                  title="Profile"
                >
                  <FaUser className="relative z-10 w-5 h-5" />
                  {/* Filling animation pseudo-element */}
                  <span className="absolute inset-0 bg-[#4ECDC4] transform scale-0 origin-center transition-transform duration-500 group-hover:scale-100 z-0 rounded-full"></span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="logout-btn relative overflow-hidden uppercase no-underline border-2 border-red-700 px-5 py-2 text-[17px] text-red-500 font-bold bg-transparent transition-colors duration-300 hover:text-white rounded-2xl shadow-lg hover:shadow-red-700/50 transform hover:scale-105 group cursor-pointer"
                >
                  <span className="relative z-10">Logout</span>
                  {/* Filling animation pseudo-element */}
                  <span className="absolute inset-0 bg-red-700 transform scale-y-0 origin-bottom transition-transform duration-500 group-hover:scale-y-100 z-0 rounded-2xl"></span>
                </button>
              </>
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
            {/* No navigation items shown regardless of user state */}
            
            <div className="flex w-full flex-col gap-4 pt-4">
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
                <>
                  {/* Mobile Profile Button */}
                  <NavbarButton
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleProfileClick();
                    }}
                    variant="secondary"
                    className="w-full bg-[#4ECDC4] hover:bg-[#45b8b8] text-white border-[#4ECDC4]"
                  >
                    <FaUser className="inline-block mr-2 w-4 h-4" />
                    Profile
                  </NavbarButton>

                  {/* Mobile Logout Button */}
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
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}