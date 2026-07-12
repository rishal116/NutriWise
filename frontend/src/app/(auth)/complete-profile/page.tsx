"use client";

import { getErrorMessage } from "@/utils/getErrorMessage";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { onboardingService } from "@/services/user/onboarding.service";
import { toast } from "sonner";
import {
  Loader2,
  User,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Leaf,
  Target,
  Clock,
  XCircle,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { completeProfileSchema } from "@/validations/onboarding.validation";

type FormFields = {
  gender: string;
  birthDate: string;
  heightCm: string;
  weightKg: string;
  activityLevel: string;
  dietType: string;
  goal: string;
  targetWeightKg: string;
  preferredTimeline: string;
};

export default function CompleteProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormFields>({
    gender: "",
    birthDate: "",
    heightCm: "",
    weightKg: "",
    activityLevel: "moderately_active",
    dietType: "veg",
    goal: "lifestyle_general",
    targetWeightKg: "",
    preferredTimeline: "12_weeks",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormFields, string>>
  >({});

  const validateField = (name: keyof FormFields, value: string) => {
    const parsed = completeProfileSchema.safeParse({
      ...form,
      [name]: ["heightCm", "weightKg", "targetWeightKg"].includes(name)
        ? value === ""
          ? undefined
          : Number(value)
        : value,
    });

    if (!parsed.success) {
      const fieldError = parsed.error.issues.find(
        (issue) => issue.path[0] === name,
      );
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError?.message ?? "",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof FormFields, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validation = completeProfileSchema.safeParse({
        gender: form.gender,
        birthDate: form.birthDate,
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        activityLevel: form.activityLevel,
        dietType: form.dietType,
        goal: form.goal,
        targetWeightKg: form.targetWeightKg
          ? Number(form.targetWeightKg)
          : undefined,
        preferredTimeline: form.preferredTimeline,
      });

      if (!validation.success) {
        const newErrors: Partial<Record<keyof FormFields, string>> = {};
        validation.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof FormFields;
          if (!newErrors[field]) newErrors[field] = issue.message;
        });
        setErrors(newErrors);
        return;
      }

      const res = await onboardingService.completeProfile(validation.data);
      toast.success(res.message || "Profile completed!");
      router.push("/");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-gray-50 border focus:bg-white focus:ring-4 outline-none transition-all text-sm text-gray-900";

  const inputClass = (field: keyof FormFields) =>
    `${inputBase} ${
      errors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-50"
        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-50"
    }`;

  const FieldError = ({ field }: { field: keyof FormFields }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
        <XCircle size={12} /> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/60 px-4 py-10 sm:py-14">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl shadow-emerald-900/10 border border-emerald-100 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <Logo size="large" linkable={false} />
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight mt-5">
              Complete your profile
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
              Help us personalise your wellness journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Personal details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Gender
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className={`${inputClass("gender")} pl-9 cursor-pointer`}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                  <FieldError field="gender" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                    <input
                      type="date"
                      name="birthDate"
                      value={form.birthDate}
                      onChange={handleChange}
                      className={`${inputClass("birthDate")} pl-9`}
                    />
                  </div>
                  <FieldError field="birthDate" />
                </div>
              </div>
            </div>

            {/* Body Metrics */}
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Body metrics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Height (cm)
                  </label>
                  <div className="relative">
                    <Ruler
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                    <input
                      type="number"
                      name="heightCm"
                      value={form.heightCm}
                      placeholder="e.g. 170"
                      onChange={handleChange}
                      className={`${inputClass("heightCm")} pl-9`}
                    />
                  </div>
                  <FieldError field="heightCm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <Weight
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                    <input
                      type="number"
                      name="weightKg"
                      value={form.weightKg}
                      placeholder="e.g. 65"
                      onChange={handleChange}
                      className={`${inputClass("weightKg")} pl-9`}
                    />
                  </div>
                  <FieldError field="weightKg" />
                </div>
              </div>
            </div>

            {/* Lifestyle */}
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Lifestyle
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Activity Level
                  </label>
                  <div className="relative">
                    <Activity
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                    <select
                      name="activityLevel"
                      value={form.activityLevel}
                      onChange={handleChange}
                      className={`${inputClass("activityLevel")} pl-9 cursor-pointer`}
                    >
                      <option value="sedentary">Sedentary</option>
                      <option value="lightly_active">Lightly Active</option>
                      <option value="moderately_active">
                        Moderately Active
                      </option>
                      <option value="active">Active</option>
                      <option value="very_active">Very Active</option>
                    </select>
                  </div>
                  <FieldError field="activityLevel" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Diet Type
                  </label>
                  <div className="relative">
                    <Leaf
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                    <select
                      name="dietType"
                      value={form.dietType}
                      onChange={handleChange}
                      className={`${inputClass("dietType")} pl-9 cursor-pointer`}
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non_veg">Non Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="eggetarian">Eggetarian</option>
                    </select>
                  </div>
                  <FieldError field="dietType" />
                </div>
              </div>
            </div>

            {/* Goals */}
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Goals
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Primary Goal
                  </label>
                  <div className="relative">
                    <Target
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                    <select
                      name="goal"
                      value={form.goal}
                      onChange={handleChange}
                      className={`${inputClass("goal")} pl-9 cursor-pointer`}
                    >
                      <option value="fitness_weight_loss">Weight Loss</option>
                      <option value="fitness_weight_gain">Weight Gain</option>
                      <option value="muscle_build">Muscle Build</option>
                      <option value="medical_diabetes">
                        Diabetes Management
                      </option>
                      <option value="medical_pcos">PCOS Management</option>
                      <option value="lifestyle_general">General Fitness</option>
                      <option value="mental_wellness">Mental Wellness</option>
                    </select>
                  </div>
                  <FieldError field="goal" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Target Weight{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Weight
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                    <input
                      type="number"
                      name="targetWeightKg"
                      value={form.targetWeightKg}
                      placeholder="e.g. 60"
                      onChange={handleChange}
                      className={`${inputClass("targetWeightKg")} pl-9`}
                    />
                  </div>
                  <FieldError field="targetWeightKg" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Preferred Timeline
                  </label>
                  <div className="relative">
                    <Clock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                    <select
                      name="preferredTimeline"
                      value={form.preferredTimeline}
                      onChange={handleChange}
                      className={`${inputClass("preferredTimeline")} pl-9 cursor-pointer`}
                    >
                      <option value="4_weeks">4 Weeks</option>
                      <option value="8_weeks">8 Weeks</option>
                      <option value="12_weeks">12 Weeks</option>
                      <option value="16_weeks">16 Weeks</option>
                      <option value="20_weeks">20 Weeks</option>
                      <option value="24_weeks">24 Weeks</option>
                    </select>
                  </div>
                  <FieldError field="preferredTimeline" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving profile...
                </>
              ) : (
                "Save & Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
