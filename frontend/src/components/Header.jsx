// frontend/src/components/Header.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Header() {
    const { currentUser, userProfile } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/'); // Redirect to landing page after logout
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <header className="relative z-20 bg-black/20 backdrop-blur-md border-b border-white/10">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center gap-3 no-underline">
                    <svg className="w-8 h-8 text-teal-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
                    </svg>
                    <span className="text-xl font-bold text-white">LawLytics</span>
                </Link>
                
                <div className="relative">
                    {currentUser ? (
                        // Logged-in view
                        <div>
                            <button 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-2 rounded-full hover:bg-white/10 transition-all duration-300 border border-white/10"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                                    {userProfile?.fullName ? userProfile.fullName.charAt(0) : 'U'}
                                </div>
                                <span className="font-semibold hidden md:block text-white">
                                    Welcome, {userProfile?.fullName ? userProfile.fullName.split(' ')[0] : 'User'}
                                </span>
                                <svg className={`w-4 h-4 transition-transform text-purple-200/80 ${dropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl py-2 border border-white/10">
                                    <Link 
                                        to="/dashboard" 
                                        className="block px-4 py-3 text-sm text-purple-200/80 hover:text-white hover:bg-white/5 transition-colors duration-300 no-underline"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button 
                                        onClick={handleLogout} 
                                        className="w-full text-left block px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors duration-300"
                                    >
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
                                <a href="#features" className="text-purple-200/80 hover:text-white transition-colors duration-300 no-underline">
                                    Features
                                </a>
                                <a href="#how-it-works" className="text-purple-200/80 hover:text-white transition-colors duration-300 no-underline">
                                    How It Works
                                </a>
                            </nav>
                            
                            {/* Get Started Button */}
                            <Link 
                                to="/auth" 
                                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:text-white font-semibold px-6 py-2 rounded-full hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/30 no-underline"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button - only show when not logged in */}
                {!currentUser && (
                    <button className="md:hidden text-white ml-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}
            </nav>
        </header>
    );
}