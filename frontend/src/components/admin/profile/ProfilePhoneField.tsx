import { Phone } from "lucide-react";

import { ProfileFieldLabel } from "./ProfileFieldLabel";

interface ProfilePhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  error: boolean;
  disabled: boolean;
}

export function ProfilePhoneField({
  value,
  onChange,
  error,
  disabled,
}: ProfilePhoneFieldProps) {
  return (
    <div className="space-y-1.5">
      <ProfileFieldLabel
        icon={<Phone size={13} className="text-emerald-600" />}
      >
        Phone Number
      </ProfileFieldLabel>

      <div
        className={`flex items-center overflow-hidden rounded-xl border transition-all focus-within:ring-2 ${
          error
            ? "border-rose-300 focus-within:ring-rose-100"
            : "border-slate-200 focus-within:border-emerald-400 focus-within:ring-emerald-100"
        } ${disabled ? "bg-slate-50" : "bg-white"}`}
      >
        <span className="border-r border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-500">
          +91
        </span>

        <input
          type="tel"
          name="phone"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder="9876543210"
          maxLength={10}
          inputMode="numeric"
          className="w-full bg-transparent px-3 py-2.5 text-sm font-medium text-slate-900 outline-none disabled:cursor-not-allowed disabled:text-slate-400"
        />
      </div>

      {error && (
        <p className="text-[11px] font-medium text-rose-600">
          Enter a valid 10-digit Indian mobile number.
        </p>
      )}
    </div>
  );
}
