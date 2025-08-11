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
  }, [dispatch, user]);

  const navItems = [
    {
      name : "Dashboard" ,
      link : "/dashboard"
    } ,
    {
      name: "Page1",
      link: "/page1", // This is already set to /page1
    },
    {
      name: "Page2",
      link: "/Page2",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const landingNavItems = [
    {
      name: "features",
      link: "",
    },
    {
      name: "about",
      link: "",
    },
    {
      name: "footer",
      link: "",
    },
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

  const handleNavigate = () => {
    navigate("/login")
  }

  return (
    <div className="relative w-full">
      <style>
        {`
                #login::before {
                    content: "";
                    position: absolute;
                    height: 100%;
                    width: 0%;
                    top: 0;
                    left: -40px;
                    transform: skewX(45deg);
                    background-color: purple;
                    z-index: -1;
                    transition: all 1s;
                }

                #login:hover::before {
                    width: 160%;
                }

                #logout::before {
                    content: "";
                    position: absolute;
                    height: 100%;
                    width: 0%;
                    top: 0;
                    left: -40px;
                    transform: skewX(45deg);
                    background-color: red;
                    z-index: -1;
                    transition: all 1s;
                }

                #logout:hover::before {
                    width: 160%;
                }
                `}
      </style>
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={user ? navItems : landingNavItems} />
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <button
                  // onClick={handleGoogleLogin}
                  onClick={handleNavigate}

                  className="login-btn relative overflow-hidden uppercase no-underline border-2 border-[#302B63] px-5 py-2 text-[17px] text-[#302B63] font-bold bg-transparent transition-colors duration-300 hover:text-white rounded-2xl shadow-lg hover:shadow-[#AEA7FF]/50 transform hover:scale-105 group cursor-pointer"
                >
                  <span className="relative z-10">Login</span>
                  {/* Filling animation pseudo-element */}
                  <span className="absolute inset-0 bg-[#AEA7FF] transform scale-y-0 origin-bottom transition-transform duration-500 group-hover:scale-y-100 z-0 rounded-2xl"></span>
                </button>
                <NavbarButton variant="primary">Admin</NavbarButton>
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

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link} // This uses item.link, which for Page1 is /page1
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {!user ? (
                <>
                  <NavbarButton
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleGoogleLogin();
                    }}
                    variant="primary"
                    className="w-full"
                  >
                    Login
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Admin
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

      {/* Navbar */}
    </div>
  );
}