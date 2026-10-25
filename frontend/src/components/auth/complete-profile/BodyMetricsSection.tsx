"use client";

import type { ChangeEvent } from "react";
import { Ruler, Weight } from "lucide-react";

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

export default function BodyMetricsSection({ form, errors, onChange }: Props) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Body metrics
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProfileField label="Height (cm)" icon={Ruler} error={errors.heightCm}>
          <input
            type="number"
            name="heightCm"
            min={1}
            max={300}
            step="any"
            value={form.heightCm}
            placeholder="e.g. 170"
            onChange={onChange}
            className={profileInputClass}
            aria-invalid={Boolean(errors.heightCm)}
          />
        </ProfileField>

        <ProfileField label="Weight (kg)" icon={Weight} error={errors.weightKg}>
          <input
            type="number"
            name="weightKg"
            min={0}
            max={700}
            step="any"
            value={form.weightKg}
            placeholder="e.g. 65"
            onChange={onChange}
            className={profileInputClass}
            aria-invalid={Boolean(errors.weightKg)}
          />
        </ProfileField>
      </div>
    </section>
  );
}
