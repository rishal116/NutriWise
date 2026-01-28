"use client";
import { useState, useEffect } from "react";
import { healthDetailsService } from "@/services/user/healthDetails.service";

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 rounded-3xl shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-2">Health Profile</h2>
            <p className="text-emerald-100">Let's personalize your wellness journey</p>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/50 space-y-10">
          <Section title="📊 Body Information" icon="💪">
            <Input label="Height (cm) *" value={form.height} error={errors.height} onChange={v => handleChange("height", v)} />
            <Input label="Weight (kg) *" value={form.weight} error={errors.weight} onChange={v => handleChange("weight", v)} />
          </Section>

          <Section title="🏃 Lifestyle" icon="⚡">
            <Select label="Activity Level *" value={form.activityLevel} error={errors.activityLevel}
              options={["Sedentary", "Light", "Moderate", "Active"]}
              onChange={v => handleChange("activityLevel", v)} />

            <Input label="Daily Water Intake (L)" value={form.dailyWaterIntake} error={errors.dailyWaterIntake}
              onChange={v => handleChange("dailyWaterIntake", v)} />

            <Select label="Sleep Duration" value={form.sleepDuration}
              options={["<6 hrs", "6–7 hrs", "7–8 hrs", ">8 hrs"]}
              onChange={v => handleChange("sleepDuration", v)} />
          </Section>

          <Section title="🥗 Nutrition & Goals" icon="🎯">
            <Select label="Diet Type" value={form.dietType}
              options={["Veg", "Non-Veg", "Vegan", "Keto", "Balanced"]}
              onChange={v => handleChange("dietType", v)} />

            <Select label="Goal *" value={form.goal} error={errors.goal}
              options={["Weight Loss", "Muscle Gain", "Maintenance"]}
              onChange={v => handleChange("goal", v)} />

            <Input label="Target Weight (kg)" value={form.targetWeight} error={errors.targetWeight}
              onChange={v => handleChange("targetWeight", v)} />

            <Input type="text" label="Focus Area (Eg: Belly, Arms)" value={form.focusArea}
              onChange={v => handleChange("focusArea", v)} />
          </Section>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full py-5 rounded-2xl text-white font-bold text-lg relative overflow-hidden group
            bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700
            disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 shadow-xl
            hover:shadow-2xl hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </span>
              ) : (
                "Save Health Profile ✨"
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, icon }: any) {
  return (
    <div className="space-y-5 relative">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-emerald-200 to-teal-200">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
          {title}
        </h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, error, type = "number" }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition-all duration-300
          bg-white/70 backdrop-blur-sm font-medium
          ${error 
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
            : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-emerald-300"
          }`}
        />
        {!error && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}

function Select({ label, value, options, onChange, error }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition-all duration-300
          bg-white/70 backdrop-blur-sm font-medium appearance-none cursor-pointer
          ${error 
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
            : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-emerald-300"
          }`}
        >
          <option value="">Select</option>
          {options.map((o: string) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          ▼
        </div>
        {!error && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}