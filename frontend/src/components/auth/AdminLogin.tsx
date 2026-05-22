"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminAuthService } from "@/services/admin/adminAuth.service";
import { adminLoginSchema } from "@/validations/adminAuth.validation";
import { ForgotPasswordModal } from "@/components/admin/ForgotPassword";
import { Toaster, toast } from "sonner";
import ANutriWiseLogo from "../layout/ANutriwiselogo";
import { loginSuccess } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function AdminLoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // ── No local redirect here; AuthProvider/Middleware handles session persistence ──


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError("");
    setErrors({});

    const result = adminLoginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = String(issue.path[0]) as keyof FieldErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await adminAuthService.login({ email, password });
      dispatch(loginSuccess({ token: res.accessToken, user: res.user }));
      toast.success(res.message || "Access Granted", {
        description: "Welcome to the NutriWise Control Center.",
      });
      setTimeout(() => router.push("/admin/dashboard"), 800);
    } catch (err: unknown) {
      let errorMessage = "Authentication failed. Please verify your credentials.";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      setGlobalError(errorMessage);
      toast.error("Access Denied", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md mx-auto"
      >
        {/* Glow halos */}
        <div className="pointer-events-none absolute -inset-px rounded-[2rem] bg-gradient-to-br from-emerald-400/20 via-transparent to-teal-400/10 blur-2xl" />

        <div className="relative rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.8)_inset] overflow-hidden">

          {/* Loading bar */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 z-50"
              />
            )}
          </AnimatePresence>

          {/* Top decorative strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

          <div className="px-8 pt-10 pb-8 sm:px-10 sm:pt-12 sm:pb-10">

            {/* ── Header ── */}
            <div className="mb-10 flex flex-col items-center text-center gap-5">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-sm shadow-emerald-100">
                <ANutriWiseLogo />
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Admin Console
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Secure access · NutriWise v2.0
                </p>
              </div>

              {/* Access-level badge */}
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-[11px] font-bold uppercase tracking-widest">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                Authorized Personnel Only
              </div>
            </div>

            {/* ── Global error ── */}
            <AnimatePresence>
              {globalError && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                    <p className="leading-snug">{globalError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-email"
                  className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span
                    className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors duration-200 ${
                      emailFocused ? "text-emerald-500" : "text-slate-400"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="admin@nutriwise.com"
                    className={`w-full rounded-xl border-2 bg-slate-50/60 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${
                      errors.email
                        ? "border-red-300 focus:border-red-400 focus:bg-white"
                        : "border-slate-200 focus:border-emerald-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-red-500 text-[11px] font-semibold pl-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="admin-password"
                    className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors underline underline-offset-2"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <span
                    className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors duration-200 ${
                      passwordFocused ? "text-emerald-500" : "text-slate-400"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="••••••••••••"
                    className={`w-full rounded-xl border-2 bg-slate-50/60 py-3.5 pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${
                      errors.password
                        ? "border-red-300 focus:border-red-400 focus:bg-white"
                        : "border-slate-200 focus:border-emerald-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-red-500 text-[11px] font-semibold pl-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit */}
              <div className="pt-1">
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #059669 0%, #0d9488 50%, #059669 100%)",
                    backgroundSize: "200% 200%",
                  }}
                >
                  {/* Shimmer on hover */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative flex items-center justify-center gap-2 tracking-wide">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Authenticating…
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Access Admin Console
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </form>

            {/* ── Footer ── */}
            <p className="mt-8 text-center text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              NutriWise © {new Date().getFullYear()} · Restricted Area
            </p>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}