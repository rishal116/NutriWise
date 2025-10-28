"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";
import { adminAuthService } from "@/services/admin/adminAuth.service";
import { adminLoginSchema } from "@/validation/adminAuth.validation";

export default function SuperAdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMessage, setForgotMessage] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        const validation = adminLoginSchema.safeParse({ email, password });
        if (!validation.success) {
            setError(validation.error.issues[0].message);
            return;
        }
        setLoading(true);
        
        try {
            const data = await adminAuthService.login({ email, password});
            alert(data.message);
            console.log("Login Response:", data);
            router.push("/admin/dashboard");
        
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials");
            setTimeout(() => setError(""), 4000);
        } finally {
            setLoading(false);
        }
    };
    
    
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotMessage("");
        
        try {
            const data = await adminAuthService.forgotPassword({email: forgotEmail,});
            setForgotMessage("Password reset link sent successfully!");
            setForgotEmail("");
        } catch (err: any) {
            setForgotMessage(err.response?.data?.message || "Failed to send reset link");
        }
    };

    
return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Card */}
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-teal-100 relative z-10 animate-in">
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

        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-teal-400 to-emerald-500 p-4 rounded-2xl shadow-lg animate-pulse">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
          Super Admin Login
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Manage your healthcare platform securely
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-6 text-sm flex items-center gap-2 animate-fade">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border-2 border-teal-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-teal-50/50 hover:bg-teal-50 text-gray-800 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="superadmin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border-2 border-teal-200 rounded-xl p-3 pr-12 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-teal-50/50 hover:bg-teal-50 text-gray-800 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

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

          <div className="text-center mt-2">
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
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-in">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Forgot Password
            </h2>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border-2 border-teal-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none bg-teal-50/50"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 rounded-xl font-semibold hover:from-teal-600 hover:to-emerald-600 transition-all duration-300"
              >
                Send Reset Link
              </button>
            </form>

            {forgotMessage && (
              <p className="text-center mt-3 text-sm text-gray-600">
                {forgotMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

