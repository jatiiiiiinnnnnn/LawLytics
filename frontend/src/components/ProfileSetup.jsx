// frontend/src/components/ProfileSetup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // You'll need to export 'db' from firebase.js

export default function ProfileSetup() {
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullName.trim() || !currentUser) return;
        
        setLoading(true);
        setError('');

        try {
            // Create a new document in the 'users' collection with the user's uid
            const userRef = doc(db, "users", currentUser.uid);
            await setDoc(userRef, {
                fullName: fullName,
                email: currentUser.email,
                createdAt: new Date()
            });
            
            navigate('/dashboard'); // Redirect to dashboard after profile is saved
        } catch (err) {
            setError('Failed to save profile. Please try again.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-2xl shadow-lg border border-slate-700">
                <h2 className="text-center text-3xl font-extrabold text-white">One Last Step!</h2>
                <p className="text-center text-slate-400">Please enter your full name to personalize your experience.</p>
                
                {error && <p className="text-center text-sm text-red-400">{error}</p>}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="fullname" className="text-sm font-bold text-slate-300 block mb-2">Full Name</label>
                        <input
                            id="fullname"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-slate-600"
                    >
                        {loading ? 'Saving...' : 'Continue to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}