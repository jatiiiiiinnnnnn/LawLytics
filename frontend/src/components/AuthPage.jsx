import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();

  // In a real app, this would make an API call to your auth backend
  const handleSubmit = (e) => {
    e.preventDefault();
    // 1. Get form data: const email = e.target.email.value;
    // 2. Make API call to login/register user
    // 3. On success:
    console.log("Form submitted. Redirecting to dashboard...");
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isLoginView ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button onClick={() => setIsLoginView(!isLoginView)} className="font-medium text-blue-600 hover:text-blue-500">
              {isLoginView ? 'start your free trial' : 'sign in to your account'}
            </button>
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isLoginView && (
            <div>
              <label htmlFor="fullname" className="text-sm font-bold text-gray-600 block">
                Full Name
              </label>
              <input 
                id="fullname" 
                name="fullname" 
                type="text" 
                required 
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-600 block">
              Email address
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              autoComplete="email" 
              required 
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div>
            <label htmlFor="password"className="text-sm font-bold text-gray-600 block">
              Password
            </label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autoComplete="current-password" 
              required 
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            {isLoginView && (
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoginView ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-500">
          <p>By signing up, you agree to our <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Terms of Service</a>.</p>
        </div>
      </div>
    </div>
  );
}