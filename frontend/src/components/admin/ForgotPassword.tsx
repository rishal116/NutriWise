import React, { useState } from "react";
import { z } from "zod";
import { adminAuthService } from "@/services/admin/adminAuth.service";
import { motion } from "framer-motion";
import { X, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const validation = forgotSchema.safeParse({ email });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await adminAuthService.forgotPassword({ email });

      setMessage("A password reset link has been sent to your email.");
      setEmail("");
    } catch (err: unknown) {
      let errorMessage = "We couldn't find an account with that email.";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center px-4 z-[100]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
      >
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <header className="mb-8">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Forgot Password
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="forgot-email"
                className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1"
              >
                Admin Email
              </label>
              <div className="relative">
                <input
                  id="forgot-email"
                  type="email"
                  required
                  placeholder="admin@nutriwise.com"
                  className={`w-full bg-slate-50 border-2 py-4 px-4 rounded-2xl text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                    error
                      ? "border-red-200 focus:border-red-500"
                      : "border-slate-50 focus:border-emerald-500"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <p>{message}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !!message}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
