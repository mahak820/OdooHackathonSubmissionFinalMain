import React, { useEffect, useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
// ADDED: Import useDispatch to connect to Redux
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// In a real app, you would import your actual login action like this:
// import { loginUser } from '../features/auth/authSlice';

const sportsHeroUrl = 'https://wallpaperaccess.com/full/5004778.jpg';

const LoginPage = ({ onSwitchToRegister }) => {
  // ADDED: Initialize the dispatch function
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const {user , isError , message} = useSelector(state => state.auth)

   useEffect(() => {
    if (user && user.role == "owner") {
      navigate("/owner/dashboard");
    }
    else if (user && user.role == "admin") {
      navigate("/admin/dashboard")
    }
    else if (user) {
      navigate("/")
    }

    if(isError) {
      toast.error("Invalid Credentials")
    }
    
  }, [dispatch, user, navigate]);

  // CHANGED: Consolidated email and password into a single formData state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // ADDED: A single handler for all form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login attempt with formData:', formData);
      
      // --- YOUR REDUX DISPATCH LOGIC GOES HERE ---
      // This is the sample function where you will dispatch your login action.
      // Just uncomment the line below and replace 'loginUser' with your actual action creator.
      // dispatch(loginUser(formData));
      // -----------------------------------------

      dispatch(loginUser(formData))

    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Background Image */}
      <div className="absolute inset-0">
        <img
          src={sportsHeroUrl}
          alt="Athletes in action on sports field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Centered Rectangular Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white/90 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl h-auto md:h-[500px] flex flex-col md:flex-row">

          {/* Left Half - Sports Text */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-orange-500/80 to-teal-500/80 flex items-center justify-center p-8 sm:p-12 text-center md:text-left">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
                Play Without
                <span className="block text-orange-300">Boundaries</span>
              </h1>
              <div className="space-y-4 text-white/90 drop-shadow-md">
                <p className="text-base sm:text-lg leading-relaxed max-w-sm mx-auto md:mx-0">
                  🏀 Basketball courts in your neighborhood
                </p>
                <p className="text-base sm:text-lg leading-relaxed max-w-sm mx-auto md:mx-0">
                  ⚽ Soccer fields ready for action
                </p>
                <p className="text-base sm:text-lg leading-relaxed max-w-sm mx-auto md:mx-0">
                  🎾 Tennis courts for every skill level
                </p>
                <p className="text-sm sm:text-base text-orange-200 font-semibold mt-6 italic">
                  "Where champions are made, one game at a time"
                </p>
              </div>
            </div>
          </div>

          {/* Right Half - Login Form */}
          <div className="w-full md:w-1/2 bg-white/90 flex items-center justify-center p-8">
            <div className="w-full max-w-sm">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sign in to your account
                </h2>
                <p className="text-gray-600 text-sm">
                  Welcome back! Please sign in below.
                </p>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200 text-gray-800 font-medium mb-6"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email" // name attribute is crucial for the handleChange function
                    type="email"
                    required
                    value={formData.email}       // CHANGED
                    onChange={handleChange}      // CHANGED
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/90 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password" // name attribute is crucial for the handleChange function
                    type="password"
                    required
                    value={formData.password}    // CHANGED
                    onChange={handleChange}      // CHANGED
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/90 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate("/register")}
                    className="text-orange-600 hover:text-orange-500 font-semibold transition-colors duration-200 hover:underline"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;