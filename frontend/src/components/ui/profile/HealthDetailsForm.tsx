"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
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
  ChevronDown,
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
  onCancel?: () => void;
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
  onCancel,
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
    const t = Number(form.targetWeightKg);

    if (!h || h < 50 || h > 300) e.heightCm = "Enter valid height (50–300 cm)";
    if (!w || w < 20 || w > 300) e.weightKg = "Enter valid weight (20–300 kg)";
    if (!form.activityLevel) e.activityLevel = "Select activity level";
    if (!form.dietType) e.dietType = "Select diet type";
    if (!form.goal) e.goal = "Select your goal";
    if (!form.preferredTimeline) e.preferredTimeline = "Select timeline";
    if (form.targetWeightKg && (!t || t < 20 || t > 300))
      e.targetWeightKg = "Enter valid target weight (20–300 kg)";

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
    } catch {
      toast.error("Failed to save health profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center gap-2">
        <span className="h-6 w-1 rounded-full bg-emerald-600" />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Health Profile
        </h1>
      </div>
      <p className="-mt-3 mb-6 text-xs font-medium text-slate-500">
        Tell us about yourself to personalize your wellness journey.
      </p>

      <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6">
        <Section title="Body Information" icon={<Ruler size={16} />}>
          <Input
            label="Height (cm)"
            value={form.heightCm}
            error={errors.heightCm}
            onChange={(v) => handleChange("heightCm", v)}
            icon={<Ruler size={13} className="text-emerald-600" />}
            required
          />
          <Input
            label="Weight (kg)"
            value={form.weightKg}
            error={errors.weightKg}
            onChange={(v) => handleChange("weightKg", v)}
            icon={<Weight size={13} className="text-emerald-600" />}
            required
          />
        </Section>

        <Section title="Lifestyle" icon={<Activity size={16} />}>
          <Select
            label="Activity Level"
            value={form.activityLevel}
            error={errors.activityLevel}
            options={ACTIVITY_LEVELS.map((a) => ({
              label: formatLabel(a),
              value: a,
            }))}
            onChange={(v) => handleChange("activityLevel", v)}
            icon={<Activity size={13} className="text-emerald-600" />}
            required
          />
        </Section>

        <Section title="Nutrition & Goals" icon={<Target size={16} />}>
          <Select
            label="Diet Type"
            value={form.dietType}
            error={errors.dietType}
            options={DIET_TYPES.map((d) => ({
              label: formatLabel(d),
              value: d,
            }))}
            onChange={(v) => handleChange("dietType", v)}
            icon={<UtensilsCrossed size={13} className="text-emerald-600" />}
            required
          />
          <Select
            label="Goal"
            value={form.goal}
            error={errors.goal}
            options={GOALS.map((g) => ({ label: formatLabel(g), value: g }))}
            onChange={(v) => handleChange("goal", v)}
            icon={<Target size={13} className="text-emerald-600" />}
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
            icon={<TrendingUp size={13} className="text-emerald-600" />}
            required
          />
          <Input
            label="Target Weight (kg)"
            value={form.targetWeightKg}
            error={errors.targetWeightKg}
            onChange={(v) => handleChange("targetWeightKg", v)}
            icon={<Weight size={13} className="text-emerald-600" />}
          />
        </Section>

        <div className="flex flex-col items-stretch justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {loading ? (
              <Loader2 size={15} className="flex-shrink-0 animate-spin" />
            ) : (
              <Save size={15} className="flex-shrink-0" />
            )}
            {loading ? "Saving…" : "Save Health Profile"}
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
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <span className="h-5 w-1 flex-shrink-0 rounded-full bg-emerald-600" />
        <div className="flex-shrink-0 rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
          {icon}
        </div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

/* ── Field helpers ── */
function FieldLabel({
  htmlFor,
  icon,
  required,
  children,
}: {
  htmlFor: string;
  icon?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
    >
      {icon}
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600">
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
      {message}
    </p>
  );
}

const controlClass = (error?: string) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 transition-all focus:outline-none focus:ring-2 ${
    error
      ? "border-rose-300 focus:ring-rose-100"
      : "border-slate-200 hover:border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100"
  }`;

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
    <div className="space-y-1.5">
      <FieldLabel htmlFor={inputId} icon={icon} required={required}>
        {label}
      </FieldLabel>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={controlClass(error)}
      />
      <FieldError message={error} />
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
    <div className="space-y-1.5">
      <FieldLabel htmlFor={selectId} icon={icon} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${controlClass(error)} cursor-pointer appearance-none pr-10`}
        >
          <option value="">Select {label}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      <FieldError message={error} />
    </div>
  );
}