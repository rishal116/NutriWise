"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { userAuthService } from "@/services/user/userAuth.service";
import { UserLoginSchema } from "@/validation/userAuth.validation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/authSlice";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/home");
    }
  }, [router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    setErrors({});
    setError("");

    const validation = UserLoginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: any = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await userAuthService.login(email, password);
      console.log(res);

      if (res.user.isBlocked) {
        setError("Your account has been blocked. Please contact support.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.accessToken);
      dispatch(loginSuccess());
      router.replace("/home");
    } catch (err: any) {
      console.log(err);
      
      const message =
        err.response?.data?.message ||
        err.message ||
        "Invalid credentials. Please try again.";

      setError(message);
      toast.error(message);
      localStorage.setItem("msg", message);
      console.log(message);
    } finally {
      setLoading(false);
    }
  };  
  
  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse || !credentialResponse.credential) {
        toast.error("Google login failed or cancelled");
        return;
      }
      const credential = credentialResponse.credential;
      const res = await userAuthService.googleSignin({ credential });
      console.log(res);
      
      const { user, accessToken } = res;
      if (user.isBlocked) {
        toast.error("Your account has been blocked by admin.");
        return;
      }
      localStorage.setItem("token", accessToken);
      dispatch(loginSuccess());
      toast.success(`Welcome back ${user.fullName}`);
      router.push("/home");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Google login failed");
    }
  };
  
  const handleGoogleLoginError = () => {
    console.error("Google Login Failed");
    toast.error("Google login failed");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 px-4 py-8 sm:py-12 lg:py-16">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl sm:text-4xl">🍃</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Sign in to continue your wellness journey
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                <Mail className="text-emerald-600" size={18} />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl bg-gray-50 border ${
                  errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                } focus:bg-white focus:ring-2 outline-none transition-all text-sm sm:text-base`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full pl-10 sm:pl-11 pr-12 py-3 sm:py-3.5 rounded-lg sm:rounded-xl bg-gray-50 border ${
                  errors.password ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                } focus:bg-white focus:ring-2 outline-none transition-all text-sm sm:text-base`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition-colors hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={(e) => handleLogin(e)}
            disabled={loading}
            className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <LogIn className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="px-3 sm:px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-xs sm:text-sm text-gray-600 mt-5 sm:mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}