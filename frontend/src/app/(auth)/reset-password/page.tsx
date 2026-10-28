"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { userAuthService } from "@/services/user/userAuth.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid or expired reset token.");
      return;
    }

    setLoading(true);

    try {
      const response = await userAuthService.resetPassword({
        token,
        newPassword: password,
        confirmPassword,
      });

      setMessage(
        response.message ||
          "Password reset successful! Redirecting to login...",
      );

      window.setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl sm:p-10">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Reset Password
        </h1>

        {message && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-center text-sm text-green-700"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              New Password
            </label>

            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 pr-12 text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 pr-12 text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
              />

              <button
                type="button"
                onClick={() => setShowConfirm((previous) => !previous)}
                aria-label={
                  showConfirm
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                aria-pressed={showConfirm}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
