"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { userAuthService } from "@/services/user/userAuth.service";
import { loginSuccess } from "@/redux/slices/authSlice";
import { loginSchema } from "@/validations/auth.validation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getErrorMessage } from "@/utils/getErrorMessage";
import Logo from "../common/Logo";

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

  const token = useSelector((state: RootState) => state.auth.token);
  useEffect(() => {
    if (token) {
      router.replace("/");
    }
  }, [token, router]);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();

    setFormErrors({});

    const validation = loginSchema.safeParse({ email, password });

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
      const res = await userAuthService.login({ email, password });

      if (!res.accessToken) {
        throw new Error("Access token missing");
      }

      dispatch(loginSuccess(res.accessToken));

      if (!res.isProfileCompleted) {
        router.replace("/complete-profile");
        return;
      }

      switch (res.activeRole) {
        case "admin":
          router.replace("/admin");
          break;
        case "nutritionist":
          router.replace("/nutritionist");
          break;
        default:
          router.replace("/");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (!credentialResponse.credential) {
      toast.error("Google authentication failed");
      return;
    }

    try {
      const res = await userAuthService.googleAuth({
        credential: credentialResponse.credential,
      });

      if (!res.accessToken) {
        toast.error("Login failed");
        return;
      }

      dispatch(loginSuccess(res.accessToken));

      if (!res.isProfileCompleted) {
        router.push("/complete-profile");
        return;
      }

      switch (res.activeRole) {
        case "admin":
          router.push("/admin");
          break;
        case "nutritionist":
          router.push("/nutritionist");
          break;
        default:
          router.push("/home");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/60 px-4 py-10 sm:py-14">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-emerald-900/10 border border-emerald-100 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <Logo size="large" linkable={false} />
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight mt-5">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
              Sign in to continue your wellness journey
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-3 py-2.5 sm:py-3 rounded-xl bg-gray-50 border ${
                    formErrors.email
                      ? "border-red-400"
                      : "border-gray-200 focus:border-emerald-500"
                  } focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1.5">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-gray-50 border ${
                    formErrors.password
                      ? "border-red-400"
                      : "border-gray-200 focus:border-emerald-500"
                  } focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1.5">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-xs text-emerald-600 font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign In <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
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

        <p className="text-center text-sm text-gray-600 mt-6">
          {`Don't have an account? `}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-emerald-600 font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}