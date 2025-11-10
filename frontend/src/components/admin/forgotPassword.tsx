import { z } from "zod";
import { useState } from "react";
import { adminAuthService } from "@/services/admin/adminAuth.service";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const validation = forgotSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      const res = await adminAuthService.forgotPassword({ email });
      setMessage("Password reset link sent successfully!");
      setEmail("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg relative w-96">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">✕</button>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-xl p-3 border-teal-200 bg-teal-50/50 focus:ring-2 focus:ring-teal-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
