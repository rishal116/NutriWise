"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { userAuthService } from "@/services/user/user.service";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await userAuthService.forgotPassword(email); 
      setMessage("Check your email for the reset link!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Forgot Password
        </h2>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-700 placeholder:text-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
