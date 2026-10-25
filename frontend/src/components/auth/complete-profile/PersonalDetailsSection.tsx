"use client";

import type { ChangeEvent } from "react";
import { Calendar, User } from "lucide-react";

import ProfileField, { profileInputClass } from "./ProfileField";
import type {
  FormErrors,
  FormFields,
} from "@/types/auth/complete-profile/complete-profile.types";

interface Props {
  form: FormFields;
  errors: FormErrors;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function PersonalDetailsSection({
  form,
  errors,
  onChange,
}: Props) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Personal details
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProfileField label="Gender" icon={User} error={errors.gender}>
          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            className={`${profileInputClass} cursor-pointer`}
            aria-invalid={Boolean(errors.gender)}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </ProfileField>

        <ProfileField
          label="Date of Birth"
          icon={Calendar}
          error={errors.birthDate}
        >
          <input
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={onChange}
            className={profileInputClass}
            aria-invalid={Boolean(errors.birthDate)}
          />
        </ProfileField>
      </div>
    </section>
  );
}
