import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";

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

const GoogleIcon = () => (
  <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.49,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
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
    
    // This is a mock implementation since firebase is not fully configured
    try {
        if (isLoginView) {
            console.log("Signing in with:", email, password);
            // await signInWithEmailAndPassword(auth, email, password);
            setTimeout(() => navigate('/dashboard'), 1000); // Simulate network request
        } else {
            console.log("Creating account for:", fullname, email);
            // await createUserWithEmailAndPassword(auth, email, password);
             setTimeout(() => navigate('/dashboard'), 1000); // Simulate network request
        }
    } catch (err) {
      setError(
        err.message.includes("auth/invalid-credential") 
          ? "Invalid email or password." 
          : "Failed to create an account. Please try again."
      );
      setLoading(false);
    }
    // setLoading(false) is handled in the setTimeout for simulation
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    // const provider = new GoogleAuthProvider();
    
    try {
      console.log("Signing in with Google");
      // await signInWithPopup(auth, provider);
      setTimeout(() => navigate('/dashboard'), 1000); // Simulate network request
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0d1a1e] text-white min-h-screen font-sans overflow-x-hidden flex items-center justify-center p-4 relative">
        {/* Background Effects */}
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
                <div className="flex items-center justify-center gap-3 relative z-10">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  {isLoginView ? 'Signing In...' : 'Creating Account...'}
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
