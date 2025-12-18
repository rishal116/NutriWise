"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { adminAuthService } from "@/services/admin/adminAuth.service";
import { adminLoginSchema } from "@/validation/adminAuth.validation";
import { ForgotPasswordModal } from "@/components/admin/ForgotPassword";

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
      alert(message);
      router.push("/admin/dashboard");
    } catch (err: any) {
        console.log(err)
        const errorMessage = err.response?.data?.message || "Invalid credentials. Please try again.";
        setGlobalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 relative overflow-hidden py-12">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-teal-300 rounded-full blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Login Card */}
      <div className="bg-white shadow-2xl rounded-3xl p-12 w-full max-w-md border border-teal-100 relative z-10 animate-in">
        <style jsx>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-in {
            animation: slideUp 0.6s ease-out;
          }
        `}</style>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">🍃</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-3 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
          Super Admin Login
        </h1>
        <p className="text-center text-gray-600 mb-10 text-sm">
          Manage your healthcare platform securely
        </p>

        {/* Global Error */}
        {globalError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-6 text-sm text-center">
            {globalError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border-2 rounded-xl p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-teal-50/50 hover:bg-teal-50 text-gray-800 placeholder-gray-400 ${
                errors.email ? "border-red-400 focus:border-red-400" : "border-teal-200"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border-2 rounded-xl p-3 pr-12 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-teal-50/50 hover:bg-teal-50 text-gray-800 placeholder-gray-400 ${
                  errors.password ? "border-red-400 focus:border-red-400" : "border-teal-200"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transform transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 hover:scale-105"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Forgot Password */}
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-sm text-teal-600 hover:text-emerald-600 font-medium transition-colors duration-200"
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
    </div>
  );
}
