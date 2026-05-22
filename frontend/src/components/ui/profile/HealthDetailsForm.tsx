"use client";

import { useEffect, useState } from "react";
import { healthDetailsService } from "@/services/user/healthDetails.service";
import {
  Activity,
  Ruler,
  Weight,
  Droplets,
  Moon,
  UtensilsCrossed,
  Target,
  TrendingUp,
  Loader2,
  Save,
  AlertCircle,
} from "lucide-react";

import {
  TIMELINES,
  ACTIVITY_LEVELS,
  DIET_TYPES,
  FITNESS_LEVELS,
  GOALS,
  ActivityLevel,
  FitnessLevel,
  DietType,
  GoalType,
  TimelineType,
} from "@/types/health.types";
import { toHealthDetailsPayload } from "@/mapper/user/healthDetails.mapper";

type FormState = {
  heightCm: string;
  weightKg: string;

  activityLevel: ActivityLevel | "";
  fitnessLevel: FitnessLevel | "";
  dietType: DietType | "";

  dailyWaterIntakeLiters: string;
  sleepDurationHours: string;

  goal: GoalType | "";
  preferredTimeline: TimelineType | "";

  customTimelineWeeks: string;

  targetWeightKg: string;
  focusAreas: string;

  allergies: string;
  dietaryRestrictions: string;
  medicalConditions: string;
  injuries: string;

  dailyStepGoal: string;
  workoutDaysPerWeek: string;
  workoutTimePerSession: string;
};
type Props = {
  onSuccess: () => void;
  initialData?: Partial<FormState>;
};

export default function HealthDetailsForm({ onSuccess, initialData }: Props) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormState>({
    heightCm: "",
    weightKg: "",

    activityLevel: "",
    fitnessLevel: "",
    dietType: "",

    dailyWaterIntakeLiters: "",
    sleepDurationHours: "",

    goal: "",
    preferredTimeline: "",

    customTimelineWeeks: "",

    targetWeightKg: "",
    focusAreas: "",

    allergies: "",
    dietaryRestrictions: "",
    medicalConditions: "",
    injuries: "",

    dailyStepGoal: "",
    workoutDaysPerWeek: "",
    workoutTimePerSession: "",
  });

  useEffect(() => {
    if (!initialData) return;

    setForm((prev) => ({
      ...prev,
      ...initialData,
    }));
  }, [initialData]);

  function handleChange<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};

    const h = Number(form.heightCm);
    const w = Number(form.weightKg);

    if (!h || h < 50 || h > 300) e.heightCm = "Enter valid height";
    if (!w || w < 20 || w > 300) e.weightKg = "Enter valid weight";

    if (!form.activityLevel) e.activityLevel = "Required";
    if (!form.fitnessLevel) e.fitnessLevel = "Required";
    if (!form.dietType) e.dietType = "Required";
    if (!form.goal) e.goal = "Required";
    if (!form.preferredTimeline) e.preferredTimeline = "Required";

    setErrors(e);
    return Object.keys(e).length === 0;
  }
  useEffect(() => {
    if (form.preferredTimeline !== "custom") {
      setForm((prev) => ({
        ...prev,
        customTimelineWeeks: "",
      }));
    }
  }, [form.preferredTimeline]);

  async function handleSubmit() {
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = toHealthDetailsPayload(form);

      await healthDetailsService.saveHealthDetails(payload);

      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl p-6 shadow space-y-8">
          <Section title="Body" icon={<Ruler />}>
            <Input
              label="Height"
              value={form.heightCm}
              onChange={(v) => handleChange("heightCm", v)}
              error={errors.heightCm}
            />
            <Input
              label="Weight"
              value={form.weightKg}
              onChange={(v) => handleChange("weightKg", v)}
              error={errors.weightKg}
            />
          </Section>

          <Section title="Lifestyle" icon={<Activity />}>
            <Select
              label="Activity Level"
              value={form.activityLevel}
              options={ACTIVITY_LEVELS.map((v) => ({ label: v, value: v }))}
              onChange={(v) => handleChange("activityLevel", v)}
            />

            <Select
              label="Fitness Level"
              value={form.fitnessLevel}
              options={FITNESS_LEVELS.map((v) => ({ label: v, value: v }))}
              onChange={(v) => handleChange("fitnessLevel", v)}
            />
          </Section>
          <Section title="Nutrition" icon={<UtensilsCrossed />}>
            <Input
              label="Daily Water (L)"
              value={form.dailyWaterIntakeLiters}
              onChange={(v) => handleChange("dailyWaterIntakeLiters", v)}
            />

            <Input
              label="Sleep Hours"
              value={form.sleepDurationHours}
              onChange={(v) => handleChange("sleepDurationHours", v)}
            />
          </Section>

          <Section title="Goals" icon={<Target />}>
            <Input
              label="Target Weight"
              value={form.targetWeightKg}
              onChange={(v) => handleChange("targetWeightKg", v)}
            />

            {form.preferredTimeline === "custom" && (
              <Input
                label="Custom Timeline (weeks)"
                value={form.customTimelineWeeks}
                onChange={(v) => handleChange("customTimelineWeeks", v)}
                error={errors.customTimelineWeeks}
                type="number"
              />
            )}
          </Section>

          <Section title="Health Details" icon={<AlertCircle />}>
            <Input
              label="Allergies (comma separated)"
              value={form.allergies}
              onChange={(v) => handleChange("allergies", v)}
            />

            <Input
              label="Dietary Restrictions"
              value={form.dietaryRestrictions}
              onChange={(v) => handleChange("dietaryRestrictions", v)}
            />

            <Input
              label="Medical Conditions"
              value={form.medicalConditions}
              onChange={(v) => handleChange("medicalConditions", v)}
            />

            <Input
              label="Injuries"
              value={form.injuries}
              onChange={(v) => handleChange("injuries", v)}
            />
          </Section>

          <Section title="Fitness Tracking" icon={<TrendingUp />}>
            <Input
              label="Daily Step Goal"
              value={form.dailyStepGoal}
              onChange={(v) => handleChange("dailyStepGoal", v)}
            />

            <Input
              label="Workout Days / Week"
              value={form.workoutDaysPerWeek}
              onChange={(v) => handleChange("workoutDaysPerWeek", v)}
            />

            <Input
              label="Workout Time (mins)"
              value={form.workoutTimePerSession}
              onChange={(v) => handleChange("workoutTimePerSession", v)}
            />
          </Section>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
/* ---------------- Section Component ---------------- */
type Option<T extends string> = {
  label: string;
  value: T;
};

function Section({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-emerald-600">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {children}
      </div>
    </div>
  );
}

/* ---------------- Input Component ---------------- */

type InputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: "number" | "text";
  icon?: React.ReactNode;
  required?: boolean;
  placeholder?: string;
};

function Input({
  label,
  value,
  onChange,
  error,
  type = "number",
  icon,
  required,
  placeholder,
}: InputProps) {
  return (
    <div className="space-y-2 group">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg border-2 outline-none transition-all duration-300
          bg-white font-medium text-sm sm:text-base
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-emerald-300"
          }`}
        />
      </div>
      {error && (
        <p className="text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------------- Select Component ---------------- */
type SelectProps<T extends string> = {
  label: string;
  value: T | "";
  options: Option<T>[];
  onChange: (v: T) => void;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
};

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  error,
  icon,
  required,
}: SelectProps<T>) {
  const selectId = `select-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="space-y-2 group">
      <label
        htmlFor={selectId}
        className="text-sm font-semibold text-gray-700 flex items-center gap-2"
      >
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className={`w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg border-2 outline-none transition-all duration-300
          bg-white font-medium appearance-none cursor-pointer text-sm sm:text-base
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-emerald-300"
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((o) => {
            // Check if the option is an object or a simple string
            const val = typeof o === "object" ? o.value : o;
            const labelStr = typeof o === "object" ? o.label : o;

            return (
              <option key={val} value={val}>
                {labelStr}
              </option>
            );
          })}
        </select>

        {/* Custom Arrow Icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
