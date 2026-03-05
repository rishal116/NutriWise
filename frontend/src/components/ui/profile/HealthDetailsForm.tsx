"use client";
import { useState, useEffect } from "react";
import { healthDetailsService } from "@/services/user/healthDetails.service";
import { 
  Activity, Ruler, Weight, Droplets, Moon, UtensilsCrossed, 
  Target, TrendingUp, Loader2, Save, AlertCircle 
} from "lucide-react";
import { HealthDetailsPayload } from "@/constants/user/healthDetails.constant";
import { TIMELINES, ACTIVITY_LEVELS, DIET_TYPES, FITNESS_LEVELS, GOALS } from "@/types/health.types";

interface HealthDetailsFormProps {
  onSuccess: () => void;
  initialData?: Partial<HealthDetailsPayload>;
}

export default function HealthDetailsForm({ onSuccess, initialData }: HealthDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    heightCm: "",
    weightKg: "",
    activityLevel: "",
    fitnessLevel: "",
    dietType: "",
    dailyWaterIntakeLiters: "",
    sleepDurationHours: "",
    goal: "",
    targetWeightKg: "",
    preferredTimeline: "",
    focusAreas: "",
  });

  // Helper to format enum strings for display
  const formatLabel = (str: string) => str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    if (!initialData) return;
    setForm({
      heightCm: initialData.heightCm?.toString() || "",
      weightKg: initialData.weightKg?.toString() || "",
      activityLevel: initialData.activityLevel || "",
      fitnessLevel: initialData.fitnessLevel || "",
      dietType: initialData.dietType || "",
      dailyWaterIntakeLiters: initialData.dailyWaterIntakeLiters?.toString() || "",
      sleepDurationHours: initialData.sleepDurationHours?.toString() || "",
      goal: initialData.goal || "",
      targetWeightKg: initialData.targetWeightKg?.toString() || "",
      preferredTimeline: initialData.preferredTimeline || "",
      focusAreas: initialData.focusAreas?.[0] || "",
    });
  }, [initialData]);

  const handleChange = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const h = +form.heightCm;
    const w = +form.weightKg;

    if (!h || h < 50 || h > 300) e.heightCm = "Enter valid height (50–300 cm)";
    if (!w || w < 20 || w > 300) e.weightKg = "Enter valid weight (20–300 kg)";
    if (!form.activityLevel) e.activityLevel = "Select activity level";
    if (!form.fitnessLevel) e.fitnessLevel = "Select fitness level";
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
      const payload: HealthDetailsPayload = {
        heightCm: +form.heightCm,
        weightKg: +form.weightKg,
        activityLevel: form.activityLevel as any,
        fitnessLevel: form.fitnessLevel as any,
        dietType: form.dietType as any,
        dailyWaterIntakeLiters: +form.dailyWaterIntakeLiters || 0,
        sleepDurationHours: +form.sleepDurationHours || 0,
        goal: form.goal as any,
        preferredTimeline: form.preferredTimeline as any,
        targetWeightKg: form.targetWeightKg ? +form.targetWeightKg : undefined,
        focusAreas: form.focusAreas ? [form.focusAreas] : [],
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 rounded-2xl shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-2">Health Profile</h2>
            <p className="text-emerald-50">Personalize your emerald wellness journey</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10 space-y-10">
          
          <Section title="Body Information" icon={<Ruler />}>
            <Input 
              label="Height (cm)" value={form.heightCm} error={errors.heightCm} 
              onChange={v => handleChange("heightCm", v)} icon={<Ruler className="text-emerald-600" />} required 
            />
            <Input 
              label="Weight (kg)" value={form.weightKg} error={errors.weightKg} 
              onChange={v => handleChange("weightKg", v)} icon={<Weight className="text-emerald-600" />} required 
            />
          </Section>

          <Section title="Lifestyle" icon={<Activity />}>
            <Select 
              label="Fitness Level" value={form.fitnessLevel} error={errors.fitnessLevel}
              options={FITNESS_LEVELS.map(f => ({ label: formatLabel(f), value: f }))}
              onChange={v => handleChange("fitnessLevel", v)} required
            />
            <Select 
              label="Activity Level" value={form.activityLevel} error={errors.activityLevel}
              options={ACTIVITY_LEVELS.map(a => ({ label: formatLabel(a), value: a }))}
              onChange={v => handleChange("activityLevel", v)} icon={<Activity className="text-emerald-600" />} required
            />
            <Input 
              label="Daily Water (L)" value={form.dailyWaterIntakeLiters} error={errors.dailyWaterIntakeLiters}
              onChange={v => handleChange("dailyWaterIntakeLiters", v)} icon={<Droplets className="text-emerald-600" />}
            />
            <Input 
              label="Sleep (Hours)" value={form.sleepDurationHours} error={errors.sleepDurationHours}
              onChange={v => handleChange("sleepDurationHours", v)} icon={<Moon className="text-emerald-600" />}
            />
          </Section>

          <Section title="Nutrition & Goals" icon={<Target />}>
            <Select 
              label="Diet Type" value={form.dietType} options={DIET_TYPES.map(d => ({ label: formatLabel(d), value: d }))}
              onChange={v => handleChange("dietType", v)} icon={<UtensilsCrossed className="text-emerald-600" />}
            />
            <Select 
              label="Goal" value={form.goal} error={errors.goal}
              options={GOALS.map(g => ({ label: formatLabel(g), value: g }))}
              onChange={v => handleChange("goal", v)} icon={<Target className="text-emerald-600" />} required
            />
            <Select
              label="Timeline" value={form.preferredTimeline} error={errors.preferredTimeline}
              options={TIMELINES.map(t => ({ label: formatLabel(t), value: t }))}
              onChange={v => handleChange("preferredTimeline", v)} required
            />
            <Input 
              label="Target Weight (kg)" value={form.targetWeightKg} error={errors.targetWeightKg}
              onChange={v => handleChange("targetWeightKg", v)} icon={<TrendingUp className="text-emerald-600" />}
            />
          </Section>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full py-4 rounded-xl text-white font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save />}
            <span>{loading ? "Saving..." : "Save Health Profile"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}



/* ---------------- Section Component ---------------- */

function Section({ title, children, icon }: any) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-emerald-600">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {children}
      </div>
    </div>
  );
}

/* ---------------- Input Component ---------------- */

function Input({ label, value, onChange, error, type = "number", icon, required, placeholder }: any) {
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
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg border-2 outline-none transition-all duration-300
          bg-white font-medium text-sm sm:text-base
          ${error 
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
function Select({ label, value, options, onChange, error, icon, required }: any) {
  const selectId = `select-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="space-y-2 group">
      <label htmlFor={selectId} className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg border-2 outline-none transition-all duration-300
          bg-white font-medium appearance-none cursor-pointer text-sm sm:text-base
          ${error 
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
            : "border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-emerald-300"
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((o: any) => {
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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