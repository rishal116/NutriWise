"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clientProfileService } from "@/services/user/clientProfile.service";

import {
  ACTIVITY_LEVELS,
  DIET_TYPES,
  GOALS,
  TIMELINES,
  ACTIVITY_LABELS,
  DIET_LABELS,
  GOAL_LABELS,
  TIMELINE_LABELS,
  ActivityLevel,
  GoalType,
  DietType,
  TimelineType,
} from "@/types/health.types";

import { ClientProfilePayload } from "@/types/clientProfile.types";
import { ClientProfileSchema } from "@/validation/clientProfile.validation";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProfileFormData {
  dateOfBirth: string;
  gender: string;
  heightCm: string;
  weightKg: string;
  goal: string;
  activityLevel: string;
  dietType: string;
  preferredTimeline: string;
  customTimelineWeeks: string;
}

type StepKey = "basics" | "body" | "goals" | "lifestyle";

interface StepConfig {
  key: StepKey;
  label: string;
  icon: string;
  fields: (keyof ProfileFormData)[];
}

// ─── Step Config ─────────────────────────────────────────────────────────────

const STEPS: StepConfig[] = [
  {
    key: "basics",
    label: "About You",
    icon: "🌱",
    fields: ["dateOfBirth", "gender"],
  },
  {
    key: "body",
    label: "Your Body",
    icon: "⚖️",
    fields: ["heightCm", "weightKg"],
  },
  {
    key: "goals",
    label: "Your Goals",
    icon: "🎯",
    fields: ["goal", "preferredTimeline", "customTimelineWeeks"],
  },
  {
    key: "lifestyle",
    label: "Lifestyle",
    icon: "🥗",
    fields: ["activityLevel", "dietType"],
  },
];

// ─── Meta Maps ────────────────────────────────────────────────────────────────

const GOAL_META: Record<GoalType, { emoji: string; desc: string }> = {
  weight_loss: { emoji: "🔥", desc: "Shed fat, feel lighter" },
  weight_gain: { emoji: "💪", desc: "Build healthy mass" },
  muscle_build: { emoji: "🏋️", desc: "Sculpt & strengthen" },
  diabetes_management: { emoji: "🩺", desc: "Balance blood sugar" },
  pcos_management: { emoji: "🌸", desc: "Hormonal harmony" },
  general_fitness: { emoji: "⚡", desc: "All-round wellness" },
  mental_wellness: { emoji: "🧘", desc: "Mind & body balance" },
  gut_health: { emoji: "🫧", desc: "Happy microbiome" },
  sports_performance: { emoji: "🏅", desc: "Peak athleticism" },
};

const ACTIVITY_META: Record<ActivityLevel, { emoji: string; desc: string }> = {
  sedentary: { emoji: "🛋️", desc: "Little to no exercise" },
  light: { emoji: "🚶", desc: "Light activity 1–3 days" },
  moderate: { emoji: "🚴", desc: "Moderate, 3–5 days" },
  active: { emoji: "🏃", desc: "Hard exercise 6–7 days" },
  very_active: { emoji: "🔝", desc: "Intense, physical job" },
};

const DIET_EMOJI: Record<DietType, string> = {
  vegetarian: "🥦",
  non_vegetarian: "🍗",
  vegan: "🌿",
  eggetarian: "🥚",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepHeader({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-6">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
      <span aria-hidden>⚠</span> {msg}
    </p>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-3 h-3 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function BmiCard({ height, weight }: { height: number; weight: number }) {
  if (height <= 0 || weight <= 0) return null;

  const bmi = weight / Math.pow(height / 100, 2);
  const rounded = Math.round(bmi * 10) / 10;

  const category =
    bmi < 18.5
      ? {
          label: "Underweight",
          color: "text-blue-500",
          bg: "bg-blue-50 border-blue-200",
        }
      : bmi < 25
        ? {
            label: "Healthy weight",
            color: "text-emerald-600",
            bg: "bg-emerald-50 border-emerald-200",
          }
        : bmi < 30
          ? {
              label: "Overweight",
              color: "text-amber-600",
              bg: "bg-amber-50 border-amber-200",
            }
          : {
              label: "Obese",
              color: "text-red-500",
              bg: "bg-red-50 border-red-200",
            };

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl border ${category.bg} mt-2`}
    >
      <div>
        <p className="text-xs text-gray-500 font-medium">Your BMI</p>
        <p className={`text-2xl font-bold ${category.color}`}>{rounded}</p>
      </div>
      <div className="h-10 w-px bg-gray-300" />
      <div>
        <p className={`text-sm font-semibold ${category.color}`}>
          {category.label}
        </p>
        <p className="text-xs text-gray-500">Based on your measurements</p>
      </div>
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div
      role="status"
      aria-label="Saving profile"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Spinner ring with brand icon */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <span className="text-xl" aria-hidden>
              🍃
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-base font-bold text-gray-800">
            Saving your profile…
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Setting up your NutriWise journey
          </p>
        </div>

        {/* Bouncing dots */}
        <div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-400"
              style={{
                animation: `nw-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes nw-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClientProfileSetupForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const [formData, setFormData] = useState<ProfileFormData>({
    dateOfBirth: "",
    gender: "",
    heightCm: "",
    weightKg: "",
    goal: "",
    activityLevel: "",
    dietType: "",
    preferredTimeline: "",
    customTimelineWeeks: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileFormData, string>>
  >({});

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    if (name === "preferredTimeline" && value !== "custom") {
      updated.customTimelineWeeks = "";
      setErrors((prev) => ({ ...prev, customTimelineWeeks: "" }));
    }

    setFormData(updated);

    const result = ClientProfileSchema.safeParse(updated);
    const fieldError = result.success
      ? ""
      : (result.error.issues.find((issue) => issue.path[0] === name)?.message ??
        "");

    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const calculateAge = (date: string): number => {
    if (!date) return 0;

    const today = new Date();
    const birthDate = new Date(date);

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const calculatedAge = calculateAge(formData.dateOfBirth);

  // Convenience wrapper so button-based selections go through the same validation path
  const selectField = (name: keyof ProfileFormData, value: string) => {
    handleChange({
      target: { name, value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const validateStep = (stepIndex: number): boolean => {
    const stepFields = STEPS[stepIndex].fields;
    const result = ClientProfileSchema.safeParse(formData);
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const f = issue.path[0] as keyof ProfileFormData;
        if (stepFields.includes(f)) newErrors[f] = issue.message;
      });
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep) || currentStep >= STEPS.length - 1) return;
    setDirection("forward");
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((s) => s + 1);
      setAnimating(false);
    }, 180);
  };

  const goBack = () => {
    if (currentStep === 0) return;
    setDirection("back");
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((s) => s - 1);
      setAnimating(false);
    }, 180);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    const fullResult = ClientProfileSchema.safeParse(formData);

    if (!fullResult.success) {
      toast.error("Please complete all fields correctly");
      return;
    }

    try {
      setLoading(true);

      const payload: ClientProfilePayload = {
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as "male" | "female" | "other",
        heightCm: Number(formData.heightCm),
        weightKg: Number(formData.weightKg),
        goal: formData.goal as GoalType,
        activityLevel: formData.activityLevel as ActivityLevel,
        dietType: formData.dietType as DietType,
        preferredTimeline: formData.preferredTimeline as TimelineType,
        customTimelineWeeks:
          formData.preferredTimeline === "custom"
            ? formData.customTimelineWeeks
            : undefined,
        fitnessLevel: "beginner",
        dailyWaterIntakeLiters: 2,
        sleepDurationHours: 8,
        profileCompleted: true,
      };

      await clientProfileService.createProfile(payload);

      toast.success("Profile completed! Welcome to NutriWise 🎉");

      router.replace("/home");
    } catch (error) {
      console.log(error);

      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────────────

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const isLast = currentStep === STEPS.length - 1;
  const step = STEPS[currentStep];

  const inputCls = (field: keyof ProfileFormData) =>
    [
      "w-full px-4 py-3.5 rounded-2xl border-2 bg-white text-gray-800 text-sm font-medium",
      "outline-none transition-all duration-200 placeholder:text-gray-400",
      errors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
        : "border-gray-100 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 hover:border-gray-200",
    ].join(" ");

  // ── Step renders ─────────────────────────────────────────────────────────────

  const renderStep = () => {
    switch (step.key) {
      case "basics":
        return (
          <div className="space-y-4">
            <StepHeader
              icon="🌱"
              title="Let's get to know you"
              desc="Tell us a bit about yourself so we can personalise your experience."
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={inputCls("dateOfBirth")}
                  max={new Date().toISOString().split("T")[0]}
                />

                <FieldError msg={errors.dateOfBirth} />
              </div>

              {/* Auto Calculated Age */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Age
                </label>

                <input
                  type="text"
                  value={calculatedAge || ""}
                  readOnly
                  placeholder="Auto"
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-700 text-sm font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["male", "female", "other"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => selectField("gender", g)}
                    className={[
                      "py-3.5 rounded-2xl border-2 text-sm font-semibold capitalize transition-all duration-200",
                      formData.gender === g
                        ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                        : "border-gray-100 bg-white text-gray-600 hover:border-emerald-200 hover:bg-emerald-50",
                    ].join(" ")}
                  >
                    {g === "male"
                      ? "👨 Male"
                      : g === "female"
                        ? "👩 Female"
                        : "🧑 Other"}
                  </button>
                ))}
              </div>
              <FieldError msg={errors.gender} />
            </div>
          </div>
        );

      case "body":
        return (
          <div className="space-y-4">
            <StepHeader
              icon="⚖️"
              title="Your body measurements"
              desc="We'll use these to calculate your ideal nutrition targets and BMI."
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Height
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="heightCm"
                    value={formData.heightCm}
                    onChange={handleChange}
                    placeholder="170"
                    className={`${inputCls("heightCm")} pr-14`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    cm
                  </span>
                </div>
                <FieldError msg={errors.heightCm} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Weight
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="weightKg"
                    value={formData.weightKg}
                    onChange={handleChange}
                    placeholder="65"
                    className={`${inputCls("weightKg")} pr-14`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    kg
                  </span>
                </div>
                <FieldError msg={errors.weightKg} />
              </div>
            </div>

            {formData.heightCm && formData.weightKg && (
              <BmiCard
                height={Number(formData.heightCm)}
                weight={Number(formData.weightKg)}
              />
            )}
          </div>
        );

      case "goals":
        return (
          <div className="space-y-4">
            <StepHeader
              icon="🎯"
              title="What's your main goal?"
              desc="Choose the one that best reflects what you want to achieve."
            />

            <div className="grid grid-cols-1 gap-2.5">
              {GOALS.map((goal) => {
                const meta = GOAL_META[goal as GoalType];
                const selected = formData.goal === goal;
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => selectField("goal", goal)}
                    className={[
                      "flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all duration-200",
                      selected
                        ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                        : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/50",
                    ].join(" ")}
                  >
                    <span className="text-2xl leading-none">{meta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold ${selected ? "text-emerald-700" : "text-gray-800"}`}
                      >
                        {GOAL_LABELS[goal as GoalType]}
                      </p>
                      <p className="text-xs text-gray-500">{meta.desc}</p>
                    </div>
                    {selected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <CheckIcon />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <FieldError msg={errors.goal} />

            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Preferred Timeline
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {TIMELINES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => selectField("preferredTimeline", t)}
                    className={[
                      "py-3 px-2 rounded-2xl border-2 text-xs font-semibold text-center transition-all duration-200",
                      formData.preferredTimeline === t
                        ? "border-teal-500 bg-teal-500 text-white shadow-lg shadow-teal-100"
                        : "border-gray-100 bg-white text-gray-600 hover:border-teal-200 hover:bg-teal-50",
                    ].join(" ")}
                  >
                    {TIMELINE_LABELS[t as TimelineType]}
                  </button>
                ))}
              </div>
              <FieldError msg={errors.preferredTimeline} />
            </div>

            {formData.preferredTimeline === "custom" && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Custom Duration
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="customTimelineWeeks"
                    value={formData.customTimelineWeeks}
                    onChange={handleChange}
                    placeholder="e.g. 16"
                    className={`${inputCls("customTimelineWeeks")} pr-20`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    weeks
                  </span>
                </div>
                <FieldError msg={errors.customTimelineWeeks} />
              </div>
            )}
          </div>
        );

      case "lifestyle":
        return (
          <div className="space-y-5">
            <StepHeader
              icon="🥗"
              title="Your lifestyle"
              desc="This helps us tailor meal plans and calorie targets to your daily routine."
            />

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Activity Level
              </label>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map((level) => {
                  const meta = ACTIVITY_META[level as ActivityLevel];
                  const selected = formData.activityLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => selectField("activityLevel", level)}
                      className={[
                        "flex items-center gap-3 w-full px-4 py-3 rounded-2xl border-2 text-left transition-all duration-200",
                        selected
                          ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                          : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/50",
                      ].join(" ")}
                    >
                      <span className="text-xl">{meta.emoji}</span>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-semibold ${selected ? "text-emerald-700" : "text-gray-700"}`}
                        >
                          {ACTIVITY_LABELS[level as ActivityLevel]}
                        </p>
                        <p className="text-xs text-gray-500">{meta.desc}</p>
                      </div>
                      {selected && (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                          <CheckIcon />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <FieldError msg={errors.activityLevel} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Diet Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                {DIET_TYPES.map((diet) => {
                  const selected = formData.dietType === diet;
                  return (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => selectField("dietType", diet)}
                      className={[
                        "flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 transition-all duration-200",
                        selected
                          ? "border-teal-500 bg-teal-50 shadow-md shadow-teal-100"
                          : "border-gray-100 bg-white hover:border-teal-200 hover:bg-teal-50/50",
                      ].join(" ")}
                    >
                      <span className="text-2xl">
                        {DIET_EMOJI[diet as DietType]}
                      </span>
                      <span
                        className={`text-xs font-semibold ${selected ? "text-teal-700" : "text-gray-600"}`}
                      >
                        {DIET_LABELS[diet as DietType]}
                      </span>
                    </button>
                  );
                })}
              </div>
              <FieldError msg={errors.dietType} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {loading && <LoadingOverlay />}

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        {/* Decorative blobs */}
        <div
          className="fixed inset-0 overflow-hidden pointer-events-none select-none"
          aria-hidden
        >
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-lg">
          {/* Brand pill */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-sm border border-gray-100">
              <span className="text-xl" aria-hidden>
                🍃
              </span>
              <span className="font-bold text-gray-800 text-sm tracking-tight">
                NutriWise
              </span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Progress bar */}
            <div className="h-1.5 bg-gray-100">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              {STEPS.map((s, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <div key={s.key} className="flex items-center gap-1.5">
                    <div
                      className={[
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                        done
                          ? "bg-emerald-500 text-white"
                          : active
                            ? "bg-emerald-500 text-white ring-4 ring-emerald-100"
                            : "bg-gray-100 text-gray-400",
                      ].join(" ")}
                    >
                      {done ? <CheckIcon /> : i + 1}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block ${active ? "text-emerald-700" : "text-gray-400"}`}
                    >
                      {s.label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`hidden sm:block w-6 h-px mx-1 ${done ? "bg-emerald-300" : "bg-gray-200"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step content */}
            <div
              className="px-6 py-6"
              style={{
                transition: "opacity 180ms ease, transform 180ms ease",
                opacity: animating ? 0 : 1,
                transform: animating
                  ? direction === "forward"
                    ? "translateX(8px)"
                    : "translateX(-8px)"
                  : "translateX(0)",
              }}
            >
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="px-6 pb-6 flex gap-3">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 bg-white text-gray-600 text-sm font-semibold
                             hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  ← Back
                </button>
              )}

              <button
                type="button"
                onClick={isLast ? handleSubmit : goNext}
                disabled={loading}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold
                           hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg shadow-emerald-200
                           disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLast ? "Complete Profile 🎉" : "Continue →"}
              </button>
            </div>

            {/* Step counter */}
            <div className="pb-4 text-center">
              <span className="text-xs text-gray-400">
                Step {currentStep + 1} of {STEPS.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
