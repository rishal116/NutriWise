"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react"; // Added icons for inputs
import { adminAuthService } from "@/services/admin/adminAuth.service";
import { adminLoginSchema } from "@/validation/adminAuth.validation";
import { ForgotPasswordModal } from "@/components/admin/ForgotPassword";
import { Toaster, toast } from "sonner";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    setErrors({});

    const result = adminLoginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = String(issue.path[0]);
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
    } catch (err: any) {
      console.log(err);
      const errorMessage =
        err.response?.data?.message || "Invalid credentials. Please try again.";
      setGlobalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8fafc] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-teal-200/40 to-emerald-200/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-blue-200/40 to-cyan-200/40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md px-4 z-10">
        <div className="bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 rounded-[2.5rem] p-8 md:p-12 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(20,184,166,0.1)]">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-tr from-teal-600 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-teal-200 rotate-3 hover:rotate-0 transition-transform duration-300 mb-6">
              <ShieldCheck className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Secure access for <span className="text-teal-600">Super Admin</span>
            </p>
          </div>

          {/* Global Error */}
          {globalError && (
            <div className="bg-red-50/50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-sm flex items-center gap-3 animate-shake">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-11 pr-4 py-4 bg-slate-50 border-0 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:ring-2 transition-all duration-200 ${
                    errors.email ? "focus:ring-red-400 ring-2 ring-red-100" : "focus:ring-teal-500/20 ring-1 ring-slate-200 hover:ring-slate-300"
                  }`}
                  placeholder="admin@healthcare.com"
                />
              </div>
              {errors.email && <p className="text-[11px] font-semibold text-red-500 ml-1 uppercase">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-11 pr-12 py-4 bg-slate-50 border-0 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:ring-2 transition-all duration-200 ${
                    errors.password ? "focus:ring-red-400 ring-2 ring-red-100" : "focus:ring-teal-500/20 ring-1 ring-slate-200 hover:ring-slate-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] font-semibold text-red-500 ml-1 uppercase">{errors.password}</p>}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pr-1">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors uppercase tracking-tighter"
              >
                Forgot Security Key?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-slate-900 text-white py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In to Console"
                )}
              </span>
            </button>
          </form>

          {/* Footer Text */}
          <p className="mt-8 text-center text-xs text-slate-400 font-medium">
            Protected by Industry Standard Encryption
          </p>
        </div>
      </div>

      {/* Keep the Forgot Password Modal */}
      {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
      
      {/* Extra styles for custom animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}