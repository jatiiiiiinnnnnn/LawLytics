import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";

// Interactive Icons
const UserIcon = ({ className = "" }) => (
  <svg className={`transition-all duration-300 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = ({ className = "" }) => (
  <svg className={`transition-all duration-300 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = ({ className = "" }) => (
  <svg className={`transition-all duration-300 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = ({ isVisible, onClick, className = "" }) => (
  <button 
    type="button" 
    onClick={onClick}
    className={`transition-all duration-300 hover:scale-110 active:scale-95 ${className}`}
  >
    {isVisible ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
      </svg>
    )}
  </button>
);

// Google Icon Component - ADDED THIS
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const LawLyticsLogo = () => (
    <div className="flex items-center justify-center mb-8">
        <div className="relative group">
            <div className="w-16 h-16 bg-[#c5a35a] rounded-3xl flex items-center justify-center shadow-2xl transform transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <svg className="w-8 h-8 text-[#0d1a1e]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a6.375 6.375 0 0 0 6.375-6.375a6.375 6.375 0 0 0-6.375-6.375a6.375 6.375 0 0 0-6.375 6.375a6.375 6.375 0 0 0 6.375 6.375Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5l-4.5-4.5" />
                </svg>
            </div>
             <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#c5a35a] rounded-full flex items-center justify-center animate-pulse shadow-lg">
               <div className="w-2 h-2 bg-white/50 rounded-full"></div>
             </div>
        </div>
    </div>
);

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/setup-profile');
      }
    } catch (err) {
      setError(
        err.message.includes("auth/invalid-credential") 
          ? "Invalid email or password." 
          : "Failed to create an account. Please try again."
      );
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#0D0B1A] text-white min-h-screen font-sans overflow-x-hidden flex items-center justify-center p-4 relative">
      {/* Background Effects - matching landing page */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-[#0d1a1e] via-[#1a2c32] to-[#0d1a1e] pointer-events-none"></div>
      <div className="fixed top-0 left-0 w-96 h-96 bg-[#c5a35a]/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#c5a35a]/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      
      {/* Main Auth Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#1a2c32] backdrop-blur-md border border-[#2a4a53] rounded-2xl shadow-2xl p-8 space-y-6 relative overflow-hidden">
          
          {/* Logo */}
          <LawLyticsLogo />
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3 text-[#c5a35a]">
              {isLoginView ? 'Welcome Back' : 'Join LawLytics'}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              {isLoginView 
                ? 'Unlock the power of AI-driven legal analysis' 
                : 'Start your journey with intelligent document insights'
              }
            </p>
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group w-full flex justify-center items-center gap-3 py-4 px-6 bg-[#223a42] hover:bg-[#2a4a53] border border-[#2a4a53] rounded-2xl text-white font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#c5a35a]/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a4a53]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#1a2c32] px-6 py-2 rounded-full text-gray-400 text-xs font-medium tracking-wider">
                OR CONTINUE WITH EMAIL
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-400/20 text-red-300 p-4 rounded-2xl text-sm backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLoginView && (
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400/60 group-focus-within:text-[#c5a35a] group-focus-within:scale-110" />
                <input 
                  id="fullname" 
                  name="fullname" 
                  type="text" 
                  placeholder="Full Name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-[#223a42] border border-[#2a4a53] rounded-2xl text-white placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-[#c5a35a]/50 focus:border-[#c5a35a]/50 focus:bg-black/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            )}

            <div className="relative group">
              <EmailIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400/60 group-focus-within:text-[#c5a35a] group-focus-within:scale-110" />
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="Email address"
                autoComplete="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full pl-12 pr-4 py-4 bg-[#223a42] border border-[#2a4a53] rounded-2xl text-white placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-[#c5a35a]/50 focus:border-[#c5a35a]/50 focus:bg-black/20 transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            <div className="relative group">
              <LockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400/60 group-focus-within:text-[#c5a35a] group-focus-within:scale-110" />
              <input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full pl-12 pr-12 py-4 bg-[#223a42] border border-[#2a4a53] rounded-2xl text-white placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-[#c5a35a]/50 focus:border-[#c5a35a]/50 focus:bg-black/20 transition-all duration-300 backdrop-blur-sm"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <EyeIcon 
                  isVisible={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400/60 hover:text-[#c5a35a]"
                />
              </div>
            </div>
            
            {isLoginView && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-[#2a4a53] bg-[#223a42] text-[#c5a35a] focus:ring-[#c5a35a]/50 transition-colors"
                  />
                  <span className="group-hover:text-white transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-[#c5a35a] hover:text-[#b5944a] transition-colors font-medium hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c5a35a] text-[#0d1a1e] hover:bg-[#b5944a] font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-[#c5a35a]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              {loading ? (
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>{isLoginView ? 'Signing In...' : 'Creating Account...'}</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  {isLoginView ? 'Sign In' : 'Create Account'}
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {isLoginView ? "New to LawLytics?" : "Already have an account?"}
              <button 
                onClick={() => setIsLoginView(!isLoginView)} 
                className="ml-2 text-[#c5a35a] hover:text-[#b5944a] font-semibold transition-colors hover:underline"
                type="button"
              >
                {isLoginView ? 'Create account' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Terms */}
          <div className="text-center text-xs text-gray-400/60">
            <p>
              By continuing, you agree to our{' '}
              <a href="#" className="text-[#c5a35a] hover:text-[#b5944a] transition-colors hover:underline">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-[#c5a35a] hover:text-[#b5944a] transition-colors hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}