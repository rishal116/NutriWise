"use client";

import { useState, useEffect } from "react";
import { healthDetailsService } from "@/services/user/healthDetails.service";
import {
  Activity,
  Ruler,
  Weight,
  UtensilsCrossed,
  Target,
  TrendingUp,
  Loader2,
  Save,
  AlertCircle,
} from "lucide-react";
import { HealthDetailsRequestDto } from "@/dtos/user/health/health-details.request.dto";
import {
  TIMELINES,
  ACTIVITY_LEVELS,
  DIET_TYPES,
  GOALS,
} from "@/types/health.types";
import type {
  ActivityLevel,
  DietType,
  GoalType,
  TimelineType,
} from "@/types/health.types";

interface HealthDetailsFormProps {
  onSuccess: () => void;
  initialData?: Partial<HealthDetailsRequestDto> | null;
}

interface FormState {
  heightCm: string;
  weightKg: string;
  activityLevel: string;
  dietType: string;
  goal: string;
  targetWeightKg: string;
  preferredTimeline: string;
}

const EMPTY_FORM: FormState = {
  heightCm: "",
  weightKg: "",
  activityLevel: "",
  dietType: "",
  goal: "",
  targetWeightKg: "",
  preferredTimeline: "",
};

const formatLabel = (str: string) =>
  str.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export default function HealthDetailsForm({
  onSuccess,
  initialData,
}: HealthDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (!initialData) return;
    setForm({
      heightCm: initialData.heightCm?.toString() ?? "",
      weightKg: initialData.weightKg?.toString() ?? "",
      activityLevel: initialData.activityLevel ?? "",
      dietType: initialData.dietType ?? "",
      goal: initialData.goal ?? "",
      targetWeightKg: initialData.targetWeightKg?.toString() ?? "",
      preferredTimeline: initialData.preferredTimeline ?? "",
    });
  }, [initialData]);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const h = Number(form.heightCm);
    const w = Number(form.weightKg);

    if (!h || h < 50 || h > 300) e.heightCm = "Enter valid height (50–300 cm)";
    if (!w || w < 20 || w > 300) e.weightKg = "Enter valid weight (20–300 kg)";
    if (!form.activityLevel) e.activityLevel = "Select activity level";
    if (!form.dietType) e.dietType = "Select diet type";
    if (!form.goal) e.goal = "Select your goal";
    if (!form.preferredTimeline) e.preferredTimeline = "Select timeline";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const payload: HealthDetailsRequestDto = {
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        activityLevel: form.activityLevel as ActivityLevel,
        dietType: form.dietType as DietType,
        goal: form.goal as GoalType,
        preferredTimeline: form.preferredTimeline as TimelineType,
        targetWeightKg: form.targetWeightKg
          ? Number(form.targetWeightKg)
          : undefined,
      };

      await healthDetailsService.saveHealthDetails(payload);
      onSuccess();
    } catch (error) {
      console.error("Save Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-emerald-600 p-8 rounded-2xl mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Health Profile</h2>
          <p className="text-emerald-50">
            Tell us about yourself to personalize your wellness journey
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 space-y-10">
          <Section title="Body Information" icon={<Ruler size={18} />}>
            <Input
              label="Height (cm)"
              value={form.heightCm}
              error={errors.heightCm}
              onChange={(v) => handleChange("heightCm", v)}
              icon={<Ruler size={16} className="text-emerald-600" />}
              required
            />
            <Input
              label="Weight (kg)"
              value={form.weightKg}
              error={errors.weightKg}
              onChange={(v) => handleChange("weightKg", v)}
              icon={<Weight size={16} className="text-emerald-600" />}
              required
            />
          </Section>

          <Section title="Lifestyle" icon={<Activity size={18} />}>
            <Select
              label="Activity Level"
              value={form.activityLevel}
              error={errors.activityLevel}
              options={ACTIVITY_LEVELS.map((a) => ({
                label: formatLabel(a),
                value: a,
              }))}
              onChange={(v) => handleChange("activityLevel", v)}
              icon={<Activity size={16} className="text-emerald-600" />}
              required
            />
          </Section>

          <Section title="Nutrition & Goals" icon={<Target size={18} />}>
            <Select
              label="Diet Type"
              value={form.dietType}
              error={errors.dietType}
              options={DIET_TYPES.map((d) => ({
                label: formatLabel(d),
                value: d,
              }))}
              onChange={(v) => handleChange("dietType", v)}
              icon={<UtensilsCrossed size={16} className="text-emerald-600" />}
              required
            />
            <Select
              label="Goal"
              value={form.goal}
              error={errors.goal}
              options={GOALS.map((g) => ({ label: formatLabel(g), value: g }))}
              onChange={(v) => handleChange("goal", v)}
              icon={<Target size={16} className="text-emerald-600" />}
              required
            />
            <Select
              label="Timeline"
              value={form.preferredTimeline}
              error={errors.preferredTimeline}
              options={TIMELINES.map((t) => ({
                label: formatLabel(t),
                value: t,
              }))}
              onChange={(v) => handleChange("preferredTimeline", v)}
              required
            />
            <Input
              label="Target Weight (kg)"
              value={form.targetWeightKg}
              error={errors.targetWeightKg}
              onChange={(v) => handleChange("targetWeightKg", v)}
              icon={<TrendingUp size={16} className="text-emerald-600" />}
            />
          </Section>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full py-4 rounded-xl text-white font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            <span>{loading ? "Saving..." : "Save Health Profile"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Section ── */
interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, children, icon }: SectionProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {children}
      </div>
    </div>
  );
}

/* ── Input ── */
interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  icon?: React.ReactNode;
  required?: boolean;
  placeholder?: string;
}

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
  const inputId = `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
      >
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg border-2 outline-none transition-colors bg-white font-medium text-sm sm:text-base ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
            : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-emerald-300"
        }`}
      />
      {error && (
        <p className="text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Select ── */
interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

function Select({
  label,
  value,
  options,
  onChange,
  error,
  icon,
  required,
}: SelectProps) {
  const selectId = `select-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="space-y-2">
      <label
        htmlFor={selectId}
        className="text-sm font-semibold text-slate-700 flex items-center gap-2"
      >
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg border-2 outline-none transition-colors bg-white font-medium appearance-none cursor-pointer text-sm sm:text-base ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-emerald-300"
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
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
