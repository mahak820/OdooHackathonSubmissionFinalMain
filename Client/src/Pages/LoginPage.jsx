import React, { useState, useEffect } from 'react';
import { auth, provider } from '../Firebase/firebase';
import { logoutUser, signInUser } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
// Make sure you have firebase configured in your project.
// For example, you might have a file like this:
// import { auth, googleProvider } from './firebase-config';
// import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

// --- SVG Icons for a polished look ---

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.618-3.226-11.283-7.581l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.494,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
);

const PasswordIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v2.586l1.707-1.707a1 1 0 111.414 1.414L12.586 8H15a1 1 0 110 2h-2.586l1.707 1.707a1 1 0 11-1.414 1.414L11 11.414V14a1 1 0 11-2 0v-2.586l-1.707 1.707a1 1 0 11-1.414-1.414L7.414 10H5a1 1 0 110-2h2.586L5.793 6.293a1 1 0 011.414-1.414L9 6.414V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


function LoginPage() {
  const [activeTab, setActiveTab] = useState('user');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');

  // --- State for Gemini API features ---
  const [securityTip, setSecurityTip] = useState('');
  const [isTipLoading, setIsTipLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch() 
  const navigate = useNavigate()

  // --- Gemini API call function ---
  const callGeminiAPI = async (prompt) => {
    const apiKey = "AIzaSyBwwwPQJyeAJXFhou1DKvSs9YIoS6lfJYs"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error("API Error Response:", await response.text());
        return `Error: ${response.statusText}`;
      }
      
      const result = await response.json();
      
      if (result.candidates && result.candidates.length > 0) {
        return result.candidates[0].content.parts[0].text;
      }
      return "Couldn't generate a response. Please try again.";

    } catch (error) {
      console.error("Fetch Error:", error);
      return "Failed to connect to the AI service.";
    }
  };

  // --- Fetch security tip when admin tab is active ---
  useEffect(() => {
    const fetchSecurityTip = async () => {
      if (activeTab === 'admin' && !securityTip) {
        setIsTipLoading(true);
        const prompt = "Generate a concise, actionable cybersecurity tip for a web application administrator. For example: 'Regularly rotate database credentials and API keys.'";
        const tip = await callGeminiAPI(prompt);
        setSecurityTip(tip.replace(/"/g, ''));
        setIsTipLoading(false);
      }
    };
    fetchSecurityTip();
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [dispatch, user]);

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

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    navigate("/admin")
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setAdminEmail('');
    setAdminPassword('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen font-sans bg-gray-100">
      <div className="flex w-full max-w-4xl overflow-hidden bg-white rounded-2xl shadow-2xl">
        
        {/* Left Panel: Image */}
        <div className="hidden md:block md:w-1/2">
            <img 
                src="https://placehold.co/600x800/e2e8f0/4a5568?text=Your\nImage\nHere&font=raleway" 
                alt="Promotional background"
                className="object-cover w-full h-full"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x800/e2e8f0/4a5568?text=Image+Not+Found'; }}
            />
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full p-8 md:w-1/2 md:p-12">
            <div className="flex flex-col justify-center h-full">
                <div>
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {activeTab === 'user' ? 'Sign in to your account' : 'Admin Panel Access'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {activeTab === 'user' ? 'Welcome back! Please sign in below.' : 'Please enter your admin credentials.'}
                        </p>
                    </div>
                    <div className="flex border-b border-gray-200">
                        <button onClick={() => switchTab('user')} className={`w-full py-3 font-semibold text-sm focus:outline-none transition-all duration-300 ${activeTab === 'user' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}>User</button>
                        <button onClick={() => switchTab('admin')} className={`w-full py-3 font-semibold text-sm focus:outline-none transition-all duration-300 ${activeTab === 'admin' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}>Admin</button>
                    </div>
                </div>

                <div className="pt-4 mt-4">
                    {activeTab === 'user' ? (
                    <div>
                        <button onClick={handleGoogleLogin} className="w-full flex justify-center items-center py-3 px-4 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
                            <GoogleIcon />
                            Sign in with Google
                        </button>
                    </div>
                    ) : (
                    <form className="space-y-6" onSubmit={handleAdminLogin}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><EmailIcon /></div>
                            <input id="email" name="email" type="email" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="admin@example.com" />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><PasswordIcon /></div>
                            <input id="password" name="password" type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="••••••••" />
                        </div>
                        {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}
                        <div>
                            <button type="submit" className="w-full py-3 px-4 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">Log In Securely</button>
                        </div>
                        {/* ✨ Admin Security Tip Section */}
                        <div className="pt-4">
                            {isTipLoading ? (
                                <div className="text-center text-sm text-gray-500 animate-pulse">Fetching security tip...</div>
                            ) : securityTip && (
                                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                                    <div className="flex items-center">
                                        <SparkleIcon />
                                        <h4 className="ml-2 text-sm font-semibold text-indigo-800">✨ Pro Tip</h4>
                                    </div>
                                    <p className="mt-1 text-sm text-indigo-700">{securityTip}</p>
                                </div>
                            )}
                        </div>
                    </form>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
