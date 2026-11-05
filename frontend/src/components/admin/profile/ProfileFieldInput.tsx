import type { InputHTMLAttributes, ReactNode } from "react";

import { ProfileFieldLabel } from "./ProfileFieldLabel";

interface ProfileFieldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: boolean;
}

export function ProfileFieldInput({
  label,
  icon,
  error,
  disabled,
  ...inputProps
}: ProfileFieldInputProps) {
  return (
    <div className="space-y-1.5">
      <ProfileFieldLabel icon={icon} required={inputProps.required}>
        {label}
      </ProfileFieldLabel>

      <input
        {...inputProps}
        disabled={disabled}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
          error
            ? "border-rose-300 focus:ring-rose-100"
            : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
        } ${
          disabled
            ? "cursor-not-allowed bg-slate-50 text-slate-400"
            : "bg-white text-slate-900"
        }`}
      />

      {error && (
        <p className="text-[11px] font-medium text-rose-600">
          Please enter a valid value
        </p>
      )}
    </div>
  );
}
