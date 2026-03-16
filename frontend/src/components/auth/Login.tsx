"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { userAuthService } from "@/services/user/userAuth.service";
import { loginSuccess } from "@/redux/slices/authSlice";
import { UserLoginSchema } from "@/validation/userAuth.validation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string>("");
  
  const token = useSelector((state: RootState) => state.auth.token);
  useEffect(() => {
    if (token) {
      router.replace("/home");
    }
  }, [token, router]);
  
  /* =========================
        LOGIN HANDLERS
  ========================= */

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();

    setFormErrors({});
    setServerError("");

    const validation = UserLoginSchema.safeParse({ email, password });

    if (!validation.success) {
      const errors: FormErrors = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        errors[field] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const res = await userAuthService.login(email, password);

      if (res.user.isBlocked) {
        const msg = "Your account has been blocked. Please contact support.";
        setServerError(msg);
        toast.error(msg);
        return;
      }

      dispatch(loginSuccess(res.accessToken));
      toast.success(`Welcome back ${res.user.fullName}`);
      router.replace("/home");

    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      setServerError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google authentication failed");
      return;
    }

    try {
      const res = await userAuthService.googleSignin({
        credential: credentialResponse.credential,
      });

      if (res.user.isBlocked) {
        toast.error("Your account has been blocked.");
        return;
      }

      dispatch(loginSuccess(res.accessToken));
      toast.success(`Welcome ${res.user.fullName}`);
      router.push("/home");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Google login failed");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  /* =========================
            UI
  ========================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 px-4 py-8 sm:py-12 lg:py-16">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100">
        
        {/* HEADER */}
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

        {/* SERVER ERROR */}
        {serverError && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl bg-gray-50 border transition-all text-sm sm:text-base outline-none focus:ring-2 focus:bg-white ${
                  formErrors.email 
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100" 
                    : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            {formErrors.email && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full pl-10 sm:pl-11 pr-12 py-3 sm:py-3.5 rounded-lg sm:rounded-xl bg-gray-50 border transition-all text-sm sm:text-base outline-none focus:ring-2 focus:bg-white ${
                  formErrors.password 
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100" 
                    : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.password}</p>
            )}
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <LogIn size={20} />
              </>
            )}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="relative my-6 sm:my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* GOOGLE LOGIN */}
        <div className="flex justify-center">
          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        </div>

        {/* FOOTER LINK */}
        <p className="text-center text-xs sm:text-sm text-gray-600 mt-6 sm:mt-8">
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