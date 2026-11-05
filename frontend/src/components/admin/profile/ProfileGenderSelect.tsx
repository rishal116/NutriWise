
import type { ChangeEvent } from "react";

import { User } from "lucide-react";

import { Gender } from "@/enums/user/user.enum";

import { ProfileFieldLabel } from "./ProfileFieldLabel";

interface ProfileGenderSelectProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}

export function ProfileGenderSelect({
  value,
  onChange,
  disabled,
}: ProfileGenderSelectProps) {
  return (
    <div className="space-y-1.5">
      <ProfileFieldLabel
        icon={<User size={13} className="text-emerald-600" />}
      >
        Gender
      </ProfileFieldLabel>

      <select
        name="gender"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 ${
          disabled
            ? "cursor-not-allowed bg-slate-50 text-slate-400"
            : "bg-white text-slate-900"
        }`}
      >
        <option value="">Select gender</option>
        <option value={Gender.MALE}>Male</option>
        <option value={Gender.FEMALE}>Female</option>
        <option value={Gender.OTHER}>Other</option>
        <option value={Gender.PREFER_NOT_TO_SAY}>
          Prefer not to say
        </option>
      </select>
    </div>
  );
}
