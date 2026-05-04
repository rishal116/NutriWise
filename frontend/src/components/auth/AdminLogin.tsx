"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { adminAuthService } from "@/services/admin/adminAuth.service";
import { adminLoginSchema } from "@/validation/adminAuth.validation";
import { ForgotPasswordModal } from "@/components/admin/ForgotPassword";
import { Toaster, toast } from "sonner";
import ANutriWiseLogo from "../layout/ANutriwiselogo";

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError("");
    setErrors({});

    const result = adminLoginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = String(issue.path[0]) as keyof FieldErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { message } = await adminAuthService.login({ email, password });
      toast.success(message || "Login successful!", {
        description: "Redirecting to your dashboard...",
      });
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        axiosErr.response?.data?.message ?? "Invalid credentials. Please try again.";
      setGlobalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />

      {/* ── Ambient orbs ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-teal-300/20 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-emerald-300/20 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #0f766e 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ── Card ── */}
      <div
        className={`relative z-10 w-full max-w-[420px] transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="rounded-[2rem] border border-white/60 bg-white/75 shadow-[0_32px_80px_-12px_rgba(15,118,110,0.15)] backdrop-blur-2xl px-8 py-10 md:px-10 md:py-12">

          {/* ── Header ── */}
          <div className="mb-10 flex flex-col items-center text-center">

            {/* Logo with ping dot */}
            <div className="relative mb-5">
              {/* Scale up the logo badge slightly for the hero position */}
              <div className="scale-125 origin-center">
                <ANutriWiseLogo />
              </div>
              {/* Live ping dot */}
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
            </div>

            {/* Divider */}
            <div className="mt-3 mb-4 h-px w-16 bg-gradient-to-r from-transparent via-teal-300 to-transparent" />

            <p className="text-sm text-slate-500">
              Sign in to your&nbsp;
              <span className="font-semibold text-teal-600">admin console</span>
            </p>
          </div>

          {/* ── Global error ── */}
          {globalError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-600 animate-[shake_0.35s_ease-in-out]">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />
              {globalError}
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Email Address
              </label>
              <div className="group relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail
                    className="h-[18px] w-[18px] text-slate-400 transition-colors group-focus-within:text-teal-500"
                    strokeWidth={1.75}
                  />
                </span>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nutriwise.com"
                  className={`block w-full rounded-xl bg-slate-50/80 py-[14px] pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-1 transition-all duration-200 focus:bg-white focus:ring-2 ${
                    errors.email
                      ? "ring-red-200 focus:ring-red-400"
                      : "ring-slate-200 hover:ring-slate-300 focus:ring-teal-400/60"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-semibold uppercase tracking-wide text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Password
              </label>
              <div className="group relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock
                    className="h-[18px] w-[18px] text-slate-400 transition-colors group-focus-within:text-teal-500"
                    strokeWidth={1.75}
                  />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className={`block w-full rounded-xl bg-slate-50/80 py-[14px] pl-11 pr-12 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-1 transition-all duration-200 focus:bg-white focus:ring-2 ${
                    errors.password
                      ? "ring-red-200 focus:ring-red-400"
                      : "ring-slate-200 hover:ring-slate-300 focus:ring-teal-400/60"
                  }`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-teal-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-semibold uppercase tracking-wide text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-semibold text-teal-600 transition-colors hover:text-teal-700"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-slate-900 py-[14px] text-sm font-bold text-white shadow-[0_6px_20px_-4px_rgba(15,118,110,0.4)] transition-all duration-300 hover:shadow-[0_10px_28px_-4px_rgba(15,118,110,0.55)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Authenticating…
                  </>
                ) : (
                  "Sign In to Console"
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-[11px] font-medium tracking-wide text-slate-400">
            🔒&nbsp; End-to-end encrypted · NutriWise v2
          </p>
        </div>
      </div>

      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&display=swap');

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-5px); }
          40%       { transform: translateX(5px); }
          60%       { transform: translateX(-3px); }
          80%       { transform: translateX(3px); }
        }
      `}</style>
    </>
  );
}