"use client";
import { useState, useEffect } from "react";
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
  AlertCircle
} from "lucide-react";

interface HealthDetailsFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export default function HealthDetailsForm({ onSuccess, initialData }: HealthDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    height: "",
    weight: "",
    activityLevel: "",
    dietType: "",
    dailyWaterIntake: "",
    sleepDuration: "",
    goal: "",
    targetWeight: "",
    preferredTimeline: "",
    focusArea: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        height: initialData.height?.toString() || "",
        weight: initialData.weight?.toString() || "",
        activityLevel: initialData.activityLevel || "",
        dietType: initialData.dietType || "",
        dailyWaterIntake: initialData.dailyWaterIntake?.toString() || "",
        sleepDuration: initialData.sleepDuration || "",
        goal: initialData.goal || "",
        targetWeight: initialData.targetWeight?.toString() || "",
        preferredTimeline: initialData.preferredTimeline || "",
        focusArea: initialData.focusArea || "",
      });
    }
  }, [initialData]);

  const handleChange = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};

    const h = +form.height;
    const w = +form.weight;
    const water = +form.dailyWaterIntake;
    const target = +form.targetWeight;

    if (!h || h < 50 || h > 300) e.height = "Enter valid height (50–300 cm)";
    if (!w || w < 20 || w > 300) e.weight = "Enter valid weight (20–300 kg)";
    if (!form.activityLevel) e.activityLevel = "Select activity level";
    if (!form.goal) e.goal = "Select your goal";

    if (form.dailyWaterIntake && (water < 0.5 || water > 10))
      e.dailyWaterIntake = "0.5 – 10 L only";

    if (form.targetWeight && (target < 20 || target > 300))
      e.targetWeight = "20 – 300 kg only";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await healthDetailsService.save({
        ...form,
        height: +form.height,
        weight: +form.weight,
        dailyWaterIntake: +form.dailyWaterIntake || 0,
        targetWeight: +form.targetWeight || 0,
      });
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 py-6 sm:py-8 lg:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 rounded-2xl shadow-xl mb-6 sm:mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              Health Profile
            </h2>
            <p className="text-emerald-50 text-sm sm:text-base">
              Let's personalize your wellness journey
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-10 space-y-8 sm:space-y-10">
          
          {/* Body Information Section */}
          <Section 
            title="Body Information" 
            icon={<Ruler className="w-5 h-5" />}
          >
            <Input 
              label="Height (cm)" 
              value={form.height} 
              error={errors.height} 
              onChange={v => handleChange("height", v)}
              icon={<Ruler className="w-5 h-5 text-emerald-600" />}
              required
            />
            <Input 
              label="Weight (kg)" 
              value={form.weight} 
              error={errors.weight} 
              onChange={v => handleChange("weight", v)}
              icon={<Weight className="w-5 h-5 text-emerald-600" />}
              required
            />
          </Section>

          {/* Lifestyle Section */}
          <Section 
            title="Lifestyle" 
            icon={<Activity className="w-5 h-5" />}
          >
            <Select 
              label="Activity Level" 
              value={form.activityLevel} 
              error={errors.activityLevel}
              options={["Sedentary", "Light", "Moderate", "Active"]}
              onChange={v => handleChange("activityLevel", v)}
              icon={<Activity className="w-5 h-5 text-emerald-600" />}
              required
            />

            <Input 
              label="Daily Water Intake (L)" 
              value={form.dailyWaterIntake} 
              error={errors.dailyWaterIntake}
              onChange={v => handleChange("dailyWaterIntake", v)}
              icon={<Droplets className="w-5 h-5 text-emerald-600" />}
            />

            <Select 
              label="Sleep Duration" 
              value={form.sleepDuration}
              options={["<6 hrs", "6–7 hrs", "7–8 hrs", ">8 hrs"]}
              onChange={v => handleChange("sleepDuration", v)}
              icon={<Moon className="w-5 h-5 text-emerald-600" />}
            />
          </Section>

          {/* Nutrition & Goals Section */}
          <Section 
            title="Nutrition & Goals" 
            icon={<Target className="w-5 h-5" />}
          >
            <Select 
              label="Diet Type" 
              value={form.dietType}
              options={["Veg", "Non-Veg", "Vegan", "Keto", "Balanced"]}
              onChange={v => handleChange("dietType", v)}
              icon={<UtensilsCrossed className="w-5 h-5 text-emerald-600" />}
            />

            <Select 
              label="Goal" 
              value={form.goal} 
              error={errors.goal}
              options={["Weight Loss", "Muscle Gain", "Maintenance"]}
              onChange={v => handleChange("goal", v)}
              icon={<Target className="w-5 h-5 text-emerald-600" />}
              required
            />

            <Input 
              label="Target Weight (kg)" 
              value={form.targetWeight} 
              error={errors.targetWeight}
              onChange={v => handleChange("targetWeight", v)}
              icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
            />

            <Input 
              type="text" 
              label="Focus Area" 
              value={form.focusArea}
              onChange={v => handleChange("focusArea", v)}
              placeholder="e.g., Belly, Arms, Overall"
              icon={<Target className="w-5 h-5 text-emerald-600" />}
            />
          </Section>

          {/* Submit Button */}
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full py-4 sm:py-5 rounded-xl text-white font-bold text-base sm:text-lg relative overflow-hidden group
            bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700
            disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 shadow-lg
            hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Health Profile</span>
              </>
            )}
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
  return (
    <div className="space-y-2 group">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg border-2 outline-none transition-all duration-300
          bg-white font-medium appearance-none cursor-pointer text-sm sm:text-base
          ${error 
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
            : "border-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-emerald-300"
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((o: string) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
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