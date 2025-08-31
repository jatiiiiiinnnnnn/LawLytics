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
            // await signOut(auth);
            console.log("User signed out.");
            navigate('/'); // Redirect to landing page after logout
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <header className="relative z-20 bg-[#1a2c32]/50 backdrop-blur-md border-b border-[#2a4a53]">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center gap-3 no-underline">
                     <svg className="w-8 h-8 text-[#c5a35a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a6.375 6.375 0 0 0 6.375-6.375a6.375 6.375 0 0 0-6.375-6.375a6.375 6.375 0 0 0-6.375 6.375a6.375 6.375 0 0 0 6.375 6.375Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5l-4.5-4.5" />
                    </svg>
                    <span className="text-xl font-bold text-white">LawLytics</span>
                </Link>
                
                <div className="relative">
                    {currentUser ? (
                        // Logged-in view
                        <div>
                            <button 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-3 bg-[#223a42]/50 backdrop-blur-sm p-2 rounded-full hover:bg-[#2a4a53]/70 transition-all duration-300 border border-[#2a4a53]"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#c5a35a] flex items-center justify-center font-bold text-[#0d1a1e] text-sm">
                                    {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="font-semibold hidden md:block text-white">
                                    Welcome, {userProfile?.fullName ? userProfile.fullName.split(' ')[0] : 'User'}
                                </span>
                                <svg className={`w-4 h-4 transition-transform text-gray-400 ${dropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#1a2c32] backdrop-blur-md rounded-2xl shadow-2xl py-2 border border-[#2a4a53]">
                                    <Link 
                                        to="/dashboard" 
                                        className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-[#223a42] transition-colors duration-300 no-underline"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button 
                                        onClick={handleLogout} 
                                        className="w-full text-left block px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-[#223a42] transition-colors duration-300"
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
                                <a href="#features" className="text-gray-400 hover:text-white transition-colors duration-300 no-underline">
                                    Features
                                </a>
                                <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors duration-300 no-underline">
                                    How It Works
                                </a>
                            </nav>
                            
                            {/* Get Started Button */}
                            <Link 
                                to="/auth" 
                                className="bg-[#c5a35a] text-[#0d1a1e] hover:bg-[#b5944a] font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#c5a35a]/20 no-underline"
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