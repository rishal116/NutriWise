"use client";

import type { ChangeEvent } from "react";
import { Clock, Target, Weight } from "lucide-react";

import ProfileField, {
  profileInputClass,
} from "./ProfileField";
import type {
  FormErrors,
  FormFields,
} from "@/types/auth/complete-profile/complete-profile.types";

interface Props {
  form: FormFields;
  errors: FormErrors;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function GoalsSection({ form, errors, onChange }: Props) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Goals
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProfileField label="Primary Goal" icon={Target} error={errors.goal}>
          <select
            name="goal"
            value={form.goal}
            onChange={onChange}
            className={`${profileInputClass} cursor-pointer`}
          >
            <option value="fitness_weight_loss">Weight Loss</option>
            <option value="fitness_weight_gain">Weight Gain</option>
            <option value="muscle_build">Muscle Build</option>
            <option value="medical_diabetes">Diabetes Management</option>
            <option value="medical_pcos">PCOS Management</option>
            <option value="lifestyle_general">General Fitness</option>
            <option value="mental_wellness">Mental Wellness</option>
          </select>
        </ProfileField>

        <ProfileField
          label="Target Weight"
          icon={Weight}
          error={errors.targetWeightKg}
          optional
        >
          <input
            type="number"
            name="targetWeightKg"
            min={0}
            max={700}
            step="any"
            value={form.targetWeightKg}
            placeholder="e.g. 60"
            onChange={onChange}
            className={profileInputClass}
            aria-invalid={Boolean(errors.targetWeightKg)}
          />
        </ProfileField>

        <div className="sm:col-span-2">
          <ProfileField
            label="Preferred Timeline"
            icon={Clock}
            error={errors.preferredTimeline}
            optional
          >
            <select
              name="preferredTimeline"
              value={form.preferredTimeline}
              onChange={onChange}
              className={`${profileInputClass} cursor-pointer`}
            >
              <option value="">No preference</option>
              <option value="4_weeks">4 Weeks</option>
              <option value="8_weeks">8 Weeks</option>
              <option value="12_weeks">12 Weeks</option>
              <option value="16_weeks">16 Weeks</option>
              <option value="20_weeks">20 Weeks</option>
              <option value="24_weeks">24 Weeks</option>
            </select>
          </ProfileField>
        </div>
      </div>
    </section>
  );
}