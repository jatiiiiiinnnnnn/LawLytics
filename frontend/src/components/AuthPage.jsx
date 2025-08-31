import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LawLyticsLogo = ({ className = "" }) => (
  <div className={`flex items-center gap-3 group ${className}`}>
    <div className="relative">
      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
        </svg>
      </div>
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500 to-purple-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
    </div>
    <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 text-transparent bg-clip-text">
      LawLytics
    </span>
  </div>
);

export default function Header() {
    const { currentUser, userProfile } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // await signOut(auth);
            console.log("User signed out.");
            navigate('/'); // Redirect to landing page after logout
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <header className="relative z-20 bg-white/5 backdrop-blur-md border-b border-white/10">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to={currentUser ? "/dashboard" : "/"} className="no-underline">
                    <LawLyticsLogo />
                </Link>
                
                <div className="relative">
                    {currentUser ? (
                        // Logged-in view
                        <div>
                            <button 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-2 pr-4 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 group"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-teal-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm shadow-lg">
                                    {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="font-semibold hidden md:block text-white group-hover:text-purple-200 transition-colors">
                                    Welcome, {userProfile?.fullName ? userProfile.fullName.split(' ')[0] : 'User'}
                                </span>
                                <svg className={`w-4 h-4 transition-all duration-300 text-purple-200/80 group-hover:text-teal-400 ${dropdownOpen ? 'rotate-180 scale-110' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl py-2 border border-white/10 overflow-hidden">
                                    {/* Subtle background gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                                    
                                    <Link 
                                        to="/dashboard" 
                                        className="relative flex items-center gap-3 px-4 py-3 text-sm text-purple-200/80 hover:text-white hover:bg-white/10 transition-all duration-300 no-underline group"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <svg className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                                        </svg>
                                        Dashboard
                                    </Link>
                                    
                                    <button 
                                        onClick={handleLogout} 
                                        className="relative w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 group"
                                    >
                                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Logged-out view with navigation for landing page
                        <div className="flex items-center gap-8">
                            {/* Navigation Links - only show on landing page */}
                            <nav className="hidden md:flex items-center gap-8">
                                <a href="#features" className="text-purple-200/80 hover:text-white transition-all duration-300 no-underline hover:scale-105 relative group">
                                    Features
                                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                                </a>
                                <a href="#how-it-works" className="text-purple-200/80 hover:text-white transition-all duration-300 no-underline hover:scale-105 relative group">
                                    How It Works
                                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                                </a>
                            </nav>
                            
                            {/* Get Started Button */}
                            <Link 
                                to="/auth" 
                                className="bg-gradient-to-r from-teal-500 to-purple-500 text-white hover:from-teal-400 hover:to-purple-400 font-semibold px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-teal-500/20 no-underline relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button - only show when not logged in */}
                {!currentUser && (
                    <button className="md:hidden text-white ml-4 p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}
            </nav>
        </header>
    );
}