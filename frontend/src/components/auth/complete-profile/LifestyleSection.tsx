"use client";

import type { ChangeEvent } from "react";
import { Activity, Leaf } from "lucide-react";

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

export default function LifestyleSection({ form, errors, onChange }: Props) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Lifestyle
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProfileField
          label="Activity Level"
          icon={Activity}
          error={errors.activityLevel}
        >
          <select
            name="activityLevel"
            value={form.activityLevel}
            onChange={onChange}
            className={`${profileInputClass} cursor-pointer`}
          >
            <option value="sedentary">Sedentary</option>
            <option value="lightly_active">Lightly Active</option>
            <option value="moderately_active">Moderately Active</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
        </ProfileField>

        <ProfileField label="Diet Type" icon={Leaf} error={errors.dietType}>
          <select
            name="dietType"
            value={form.dietType}
            onChange={onChange}
            className={`${profileInputClass} cursor-pointer`}
          >
            <option value="veg">Vegetarian</option>
            <option value="non_veg">Non Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="eggetarian">Eggetarian</option>
          </select>
        </ProfileField>
      </div>
    </section>
  );
}
