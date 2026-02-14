"use client";

import { useState } from "react";
import { Save, Lock, Eye, EyeOff, ArrowLeft, Shield, Check } from "lucide-react";
import Toast from "@/components/common/Toast";
import { userAccountService } from "@/services/user/userAccount.service";
import { useRouter } from "next/navigation";
import { strongPasswordSchema } from "@/validation/password.validation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 1, label: "Weak", color: "bg-red-500" },
      { strength: 2, label: "Fair", color: "bg-orange-500" },
      { strength: 3, label: "Good", color: "bg-yellow-500" },
      { strength: 4, label: "Strong", color: "bg-emerald-500" },
      { strength: 5, label: "Very Strong", color: "bg-emerald-600" },
    ];

    return levels.find(l => l.strength === strength) || levels[0];
  };

  const passwordStrength = getPasswordStrength(form.newPassword);
  const passwordsMatch = form.newPassword && form.confirmPassword && form.newPassword === form.confirmPassword;

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      setToast({ message: "Passwords do not match", type: "error" });
      return;
    }
    const passwordValidation = strongPasswordSchema.safeParse(form.newPassword);
    if (!passwordValidation.success) {
      setToast({
        message: passwordValidation.error.issues[0].message,
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await userAccountService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setToast({ message: "Password changed successfully", type: "success" });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      // Redirect after success
      setTimeout(() => {
        router.push("/settings");
      }, 1000);
    } catch (error:any) {
      const message = error?.response?.data?.message || "Something went wrong. Please try again.";
      setToast({message,type: "error",});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-2xl mx-auto p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Settings</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl">
              <Lock className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Change Password
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Update your password to keep your account secure
          </p>
        </div>

        {/* Security Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Password Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use at least 8 characters (12+ recommended)</li>
                <li>• Mix uppercase and lowercase letters</li>
                <li>• Include numbers and special characters</li>
                <li>• Avoid common words or personal information</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                placeholder="Enter your current password"
                value={form.currentPassword}
                onChange={handleChange}
                className="w-full p-4 pr-12 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                placeholder="Enter your new password"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full p-4 pr-12 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {form.newPassword && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Password Strength</span>
                  <span className={`text-xs font-semibold ${
                    passwordStrength.strength >= 4 ? 'text-emerald-600' : 
                    passwordStrength.strength >= 3 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter your new password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full p-4 pr-12 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Match Indicator */}
            {form.confirmPassword && (
              <div className="mt-2 flex items-center gap-2">
                {passwordsMatch ? (
                  <>
                    <Check size={16} className="text-emerald-600" />
                    <span className="text-sm text-emerald-600 font-medium">Passwords match</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-red-600 font-medium">Passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !form.currentPassword || !form.newPassword || !passwordsMatch}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          After changing your password, you'll be redirected to settings
        </p>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}