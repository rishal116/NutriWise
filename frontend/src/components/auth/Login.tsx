"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import toast from "react-hot-toast";

import { userAuthService } from "@/services/user/userAuth.service";
import { loginSchema } from "@/validations/auth.validation";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { isAuthPage } from "@/lib/auth/authGuard";
import { useAppDispatch } from "@/redux/hooks";
import { setAccessToken, setUser } from "@/redux/slices/authSlice";
import Logo from "../common/Logo";

interface FormErrors {
  email?: string;
  password?: string;
}

type ActiveRole = "admin" | "nutritionist" | "user";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isNavigating, setIsNavigating] = useState(false);

  const redirectAfterAuth = (activeRole: ActiveRole) => {
    const redirectParam = searchParams.get("redirect");

    if (
      redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("//") &&
      !isAuthPage(redirectParam)
    ) {
      router.replace(redirectParam);
      return;
    }

    switch (activeRole) {
      case "admin":
        router.replace("/admin/dashboard");
        break;
      case "nutritionist":
        router.replace("/nutritionist/dashboard");
        break;
      default:
        router.replace("/");
    }
  };

  const completeAuthentication = async (
    accessToken: string,
    activeRole: ActiveRole,
    isProfileCompleted: boolean,
  ) => {
    dispatch(setAccessToken(accessToken));

    const response = await userAuthService.getMe();

    if (!response.data) {
      throw new Error("Unable to retrieve your account details.");
    }

    dispatch(setUser(response.data));

    if (!isProfileCompleted) {
      router.replace("/complete-profile");
      return;
    }

    redirectAfterAuth(activeRole);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || googleLoading) return;

    setFormErrors({});

    const validation = loginSchema.safeParse({
      email: email.trim(),
      password,
    });

    if (!validation.success) {
      const errors: FormErrors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (field === "email" || field === "password") {
          errors[field] = issue.message;
        }
      });

      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const response = await userAuthService.login({
        email: email.trim(),
        password,
      });

      if (!response.success) {
        toast.error(response.message || "Login failed.");
        return;
      }

      const { accessToken, activeRole, isProfileCompleted } = response.data;

      await completeAuthentication(accessToken, activeRole, isProfileCompleted);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (loading || googleLoading) return;

    if (!credentialResponse.credential) {
      toast.error("Google authentication failed.");
      return;
    }

    setGoogleLoading(true);

    try {
      const response = await userAuthService.googleAuth({
        credential: credentialResponse.credential,
      });

      if (!response.success) {
        toast.error(response.message || "Google sign-in failed.");
        return;
      }

      const { accessToken, activeRole, isProfileCompleted } = response.data;

      await completeAuthentication(accessToken, activeRole, isProfileCompleted);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignup = () => {
    if (isNavigating) return;

    setIsNavigating(true);
    router.push("/signup");
  };

  const isSubmitting = loading || googleLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50/60 px-4 py-10 sm:py-14">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/10 sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <Logo size="large" linkable={false} />

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-[28px]">
              Welcome back
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">
              Sign in to continue your wellness journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(formErrors.email)}
                  aria-describedby={
                    formErrors.email ? "email-error" : undefined
                  }
                  className={`w-full rounded-xl border bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-emerald-50 sm:py-3 ${
                    formErrors.email
                      ? "border-red-400"
                      : "border-gray-200 focus:border-emerald-500"
                  }`}
                />
              </div>

              {formErrors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-red-500">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={Boolean(formErrors.password)}
                  aria-describedby={
                    formErrors.password ? "password-error" : undefined
                  }
                  className={`w-full rounded-xl border bg-gray-50 py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-emerald-50 sm:py-3 ${
                    formErrors.password
                      ? "border-red-400"
                      : "border-gray-200 focus:border-emerald-500"
                  }`}
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {formErrors.password && (
                <p id="password-error" className="mt-1.5 text-xs text-red-500">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => router.push("/forgot-password")}
                className="text-xs font-semibold text-emerald-600 hover:underline disabled:opacity-50"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700 active:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <LogIn className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>

            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            {googleLoading ? (
              <div className="flex items-center gap-2 py-3 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in with Google...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed.")}
                theme="outline"
                size="large"
                width="100%"
              />
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={handleSignup}
            disabled={isNavigating || isSubmitting}
            className="inline-flex items-center gap-2 font-semibold text-emerald-600 hover:underline disabled:cursor-not-allowed"
          >
            {isNavigating ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                Loading...
              </>
            ) : (
              "Sign up"
            )}
          </button>
        </p>
      </div>
    </div>
  );
}
