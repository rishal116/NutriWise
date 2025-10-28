"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Heart, ArrowLeft, Sparkles, Shield } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Logging in with:", { email, password, rememberMe });
    alert("Login successful!");
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Email Field */}
      <div className="relative group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 transition-colors group-focus-within:text-green-600" size={20} />
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-700"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="relative group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 transition-colors group-focus-within:text-green-600" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-700"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-900">Remember me</span>
        </label>
        <a href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline">
          Forgot password?
        </a>
      </div>

      {/* Login Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Logging In...</span>
          </>
        ) : (
          <>
            <span>Log In</span>
            <Shield className="w-5 h-5" />
          </>
        )}
      </button>

      {/* OR Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-gray-400 text-sm font-medium">OR</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Google</span>
        </button>

        <button
          type="button"
          className="flex items-center justify-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all group"
        >
          <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span className="text-sm font-medium">Facebook</span>
        </button>
      </div>

      {/* Create Account Link */}
      <p className="text-center text-sm text-gray-600 mt-6 pt-4 border-t border-gray-100">
        Don't have an account?{" "}
        <a href="/signup" className="text-green-600 font-semibold hover:text-green-700 hover:underline transition-colors">
          Create Account
        </a>
      </p>
    </div>
  );
}

