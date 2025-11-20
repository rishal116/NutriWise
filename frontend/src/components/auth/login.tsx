"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { userAuthService } from "@/services/user/user.service";
import { UserLoginSchema } from "@/validation/userAuth.validation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();

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

    if (res.user.isBlocked) {
      setError("Your account has been blocked. Please contact support.");
      setLoading(false);
      return;
    }

    localStorage.setItem("token", res.accessToken);
    dispatch(loginSuccess());
    router.push("/home");
  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Invalid credentials. Please try again.";

    setError(message);
    toast.error(message);
    localStorage.setItem("msg",message)
    console.log(message)
  } finally {
    setLoading(false);
  }
};  
  
  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const credential = credentialResponse.credential;
      if (!credential) {
        toast.error("Google login failed");
        return;
      }
      const res = await userAuthService.googleSignin({ credential });
      const { user, accessToken } = res;
      localStorage.setItem( "token", accessToken );
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-12 sm:py-16 lg:py-20">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl">🍃</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Sign in to continue your wellness journey
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Mail className="text-green-500" size={18} />
              </div>
              <input
              type="email"
              placeholder="you@example.com"
              className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border ${
                errors.email ? "border-red-400" : "border-gray-200"
              } focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition-all`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                </div>
                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                    <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full pl-11 pr-12 py-3.5 rounded-xl bg-gray-50 border ${
                      errors.password ? "border-red-400" : "border-gray-200"
                    } focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100 outline-none transition-all`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                        </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
  type="button"
  onClick={(e) => handleLogin(e)}
  disabled={loading}
  className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  ) : (
    <>
      <span>Sign In</span>
      <LogIn className="w-5 h-5" />
    </>
  )}
</button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
          theme="outline"
          size="large"
          width="100%"
          />

        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-green-600 hover:text-green-700 font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}