"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { userAccountService } from "@/services/user/userAccount.service";
import { strongPasswordSchema } from "@/validations/password.validation";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordVisibility {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

const INITIAL_FORM: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const INITIAL_VISIBILITY: PasswordVisibility = {
  current: false,
  new: false,
  confirm: false,
};

const STRENGTH_LEVELS = [
  { strength: 1, label: "Weak", color: "bg-admin-danger" },
  { strength: 2, label: "Fair", color: "bg-admin-warning" },
  { strength: 3, label: "Good", color: "bg-admin-accent/60" },
  { strength: 4, label: "Strong", color: "bg-admin-success" },
  { strength: 5, label: "Very Strong", color: "bg-admin-accent" },
];

const getPasswordStrength = (password: string) => {
  if (!password) {
    return { strength: 0, label: "", color: "" };
  }

  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return (
    STRENGTH_LEVELS.find((level) => level.strength === strength) ??
    STRENGTH_LEVELS[0]
  );
};

const INPUT_CLASS =
  "w-full rounded-xl border border-admin-border bg-admin-surface p-4 pr-12 text-admin-text outline-none transition-colors placeholder:text-admin-muted focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/30 disabled:cursor-not-allowed disabled:bg-admin-surface-hover";

const LABEL_CLASS = "mb-2 block text-sm font-semibold text-admin-text";

const EYE_BUTTON_CLASS =
  "absolute right-4 top-1/2 -translate-y-1/2 text-admin-muted transition-colors hover:text-admin-text";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [form, setForm] = useState<PasswordForm>(INITIAL_FORM);
  const [showPasswords, setShowPasswords] =
    useState<PasswordVisibility>(INITIAL_VISIBILITY);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const passwordStrength = getPasswordStrength(form.newPassword);

  const passwordsMatch =
    Boolean(form.newPassword) &&
    Boolean(form.confirmPassword) &&
    form.newPassword === form.confirmPassword;

  const handleSubmit = async () => {
    if (loading) return;

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const passwordValidation = strongPasswordSchema.safeParse(form.newPassword);

    if (!passwordValidation.success) {
      toast.error(
        passwordValidation.error.issues[0]?.message ?? "Invalid password.",
      );
      return;
    }

    setLoading(true);

    try {
      await userAccountService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success("Password changed successfully!");

      setForm(INITIAL_FORM);
      setShowPasswords(INITIAL_VISIBILITY);

      router.replace("/admin/settings");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={() => router.back()}
        className="group mb-6 flex items-center gap-2 text-admin-muted transition-colors hover:text-admin-accent"
      >
        <ArrowLeft
          size={20}
          className="transition-transform group-hover:-translate-x-1"
        />
        <span className="font-medium">Back to Settings</span>
      </button>

      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-xl bg-admin-accent p-2.5">
            <Lock className="text-admin-accent-fg" size={22} />
          </div>

          <h1 className="text-2xl font-bold text-admin-text">
            Change Password
          </h1>
        </div>

        <p className="text-sm font-medium text-admin-muted">
          Update your password to keep your account secure.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-admin-border bg-admin-pastel-blue p-5">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 shrink-0 text-admin-accent" size={20} />

          <div>
            <h3 className="mb-2 font-semibold text-admin-text">
              Password Tips
            </h3>

            <ul className="space-y-1 text-sm text-admin-text/80">
              <li>• Use at least 8 characters (12+ recommended).</li>
              <li>• Mix uppercase and lowercase letters.</li>
              <li>• Include numbers and special characters.</li>
              <li>• Avoid common words or personal information.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-2xl border border-admin-border bg-admin-surface p-6 shadow-sm shadow-admin-text/5 sm:p-8">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className={LABEL_CLASS}>
            Current Password
          </label>

          <div className="relative">
            <input
              id="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              placeholder="Enter your current password"
              value={form.currentPassword}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={loading}
              className={INPUT_CLASS}
            />

            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              aria-label={
                showPasswords.current
                  ? "Hide current password"
                  : "Show current password"
              }
              className={EYE_BUTTON_CLASS}
            >
              {showPasswords.current ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className={LABEL_CLASS}>
            New Password
          </label>

          <div className="relative">
            <input
              id="newPassword"
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              placeholder="Enter your new password"
              value={form.newPassword}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={loading}
              className={INPUT_CLASS}
            />

            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              aria-label={
                showPasswords.new ? "Hide new password" : "Show new password"
              }
              className={EYE_BUTTON_CLASS}
            >
              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {form.newPassword && (
            <div className="mt-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-admin-muted">
                  Password Strength
                </span>

                <span
                  className={`text-xs font-semibold ${
                    passwordStrength.strength >= 4
                      ? "text-admin-success"
                      : passwordStrength.strength >= 3
                        ? "text-admin-warning"
                        : "text-admin-danger"
                  }`}
                >
                  {passwordStrength.label}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-admin-border">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{
                    width: `${(passwordStrength.strength / 5) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className={LABEL_CLASS}>
            Confirm New Password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter your new password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={loading}
              className={INPUT_CLASS}
            />

            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              aria-label={
                showPasswords.confirm
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              className={EYE_BUTTON_CLASS}
            >
              {showPasswords.confirm ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {form.confirmPassword && (
            <div className="mt-2 flex items-center gap-2">
              {passwordsMatch ? (
                <>
                  <Check size={16} className="text-admin-success" />
                  <span className="text-sm font-medium text-admin-success">
                    Passwords match
                  </span>
                </>
              ) : (
                <span className="text-sm font-medium text-admin-danger">
                  Passwords do not match
                </span>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={
            loading ||
            !form.currentPassword ||
            !form.newPassword ||
            !form.confirmPassword ||
            !passwordsMatch
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-admin-accent py-4 font-semibold text-admin-accent-fg transition-colors hover:bg-admin-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-admin-accent-fg border-t-transparent" />
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

      <p className="mt-6 text-center text-sm text-admin-muted">
        After changing your password, you&apos;ll return to settings.
      </p>
    </div>
  );
}