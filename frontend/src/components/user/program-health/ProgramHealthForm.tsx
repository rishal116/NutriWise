"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { CreateProgramHealthDTO } from "@/dtos/user/program-health/create-program-health.dto";
import type { ProgramHealthResponseDTO } from "@/dtos/user/program-health/program-health-response.dto";
import { userProgramHealthService } from "@/services/user/program-health.service";
import {
  programHealthSchema,
  type ProgramHealthFormValues,
} from "@/schemas/user/program-health/program-health.schema";

import {
  ACTIVITY_LEVELS,
  type ActivityLevel,
} from "@/constants/user/health/activity-level.constants";

import {
  DIET_TYPES,
  type DietType,
} from "@/constants/user/health/diet-type.constants";

const isActivityLevel = (value: string): value is ActivityLevel =>
  ACTIVITY_LEVELS.some((level) => level === value);

const isDietType = (value: string): value is DietType =>
  DIET_TYPES.some((diet) => diet === value);

const ACTIVITY_LABELS: Record<(typeof ACTIVITY_LEVELS)[number], string> = {
  sedentary: "Sedentary",
  lightly_active: "Lightly active",
  moderately_active: "Moderately active",
  active: "Active",
  very_active: "Very active",
};

const DIET_LABELS: Record<(typeof DIET_TYPES)[number], string> = {
  veg: "Vegetarian",
  non_veg: "Non-vegetarian",
  vegan: "Vegan",
  eggetarian: "Eggetarian",
  pescatarian: "Pescatarian",
  keto: "Keto",
  paleo: "Paleo",
  mediterranean: "Mediterranean",
  jain: "Jain",
};

interface ProgramHealthFormProps {
  programId: string;
  initialData?: ProgramHealthResponseDTO | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const splitList = (value: string): string[] =>
  value
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);

const listToString = (values?: string[]): string => values?.join(", ") ?? "";

const toOptionalNumber = (value: string): number | undefined =>
  value.trim() === "" ? undefined : Number(value);

const defaultValues: ProgramHealthFormValues = {
  heightCm: "",
  currentWeightKg: "",
  targetWeightKg: "",
  activityLevel: "",
  dietType: "",
  medicalConditions: "",
  allergies: "",
  dietaryRestrictions: "",
  foodPreferences: "",
  dislikedFoods: "",
  mealsPerDay: "",
  dailyWaterIntakeLiters: "",
  averageSleepHours: "",
  additionalNotes: "",
};

export default function ProgramHealthForm({
  programId,
  initialData,
  onSuccess,
  onCancel,
}: ProgramHealthFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProgramHealthFormValues>({
    resolver: zodResolver(programHealthSchema),
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (!initialData) {
      reset(defaultValues);
      return;
    }

    reset({
      heightCm: String(initialData.heightCm),
      currentWeightKg: String(initialData.currentWeightKg),
      targetWeightKg: initialData.targetWeightKg
        ? String(initialData.targetWeightKg)
        : "",
      activityLevel: initialData.activityLevel,
      dietType: initialData.dietType,
      medicalConditions: listToString(initialData.medicalConditions),
      allergies: listToString(initialData.allergies),
      dietaryRestrictions: listToString(initialData.dietaryRestrictions),
      foodPreferences: listToString(initialData.foodPreferences),
      dislikedFoods: listToString(initialData.dislikedFoods),
      mealsPerDay: initialData.mealsPerDay
        ? String(initialData.mealsPerDay)
        : "",
      dailyWaterIntakeLiters:
        initialData.dailyWaterIntakeLiters !== undefined
          ? String(initialData.dailyWaterIntakeLiters)
          : "",
      averageSleepHours:
        initialData.averageSleepHours !== undefined
          ? String(initialData.averageSleepHours)
          : "",
      additionalNotes: initialData.additionalNotes ?? "",
    });
  }, [initialData, reset]);

  const onSubmit = async (values: ProgramHealthFormValues) => {
    if (
      !isActivityLevel(values.activityLevel) ||
      !isDietType(values.dietType)
    ) {
      return;
    }

    const payload: CreateProgramHealthDTO = {
      heightCm: Number(values.heightCm),
      currentWeightKg: Number(values.currentWeightKg),
      targetWeightKg: toOptionalNumber(values.targetWeightKg),
      activityLevel: values.activityLevel,
      dietType: values.dietType,
      medicalConditions: splitList(values.medicalConditions),
      allergies: splitList(values.allergies),
      dietaryRestrictions: splitList(values.dietaryRestrictions),
      foodPreferences: splitList(values.foodPreferences),
      dislikedFoods: splitList(values.dislikedFoods),
      mealsPerDay: toOptionalNumber(values.mealsPerDay),
      dailyWaterIntakeLiters: toOptionalNumber(values.dailyWaterIntakeLiters),
      averageSleepHours: toOptionalNumber(values.averageSleepHours),
      additionalNotes: values.additionalNotes.trim() || undefined,
    };

    if (initialData) {
      await userProgramHealthService.updateProgramHealth(programId, payload);
    } else {
      await userProgramHealthService.createProgramHealth(programId, payload);
    }

    onSuccess();
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  const labelClass = "mb-2 block text-sm font-medium text-gray-700";

  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Basic measurements
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Tell us about your current body measurements.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Height (cm) *</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 175"
              className={inputClass}
              {...register("heightCm")}
            />
            {errors.heightCm && (
              <p className={errorClass}>{errors.heightCm.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Current weight (kg) *</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 75"
              className={inputClass}
              {...register("currentWeightKg")}
            />
            {errors.currentWeightKg && (
              <p className={errorClass}>{errors.currentWeightKg.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Target weight (kg)</label>
            <input
              type="number"
              step="0.1"
              placeholder="Optional"
              className={inputClass}
              {...register("targetWeightKg")}
            />
            {errors.targetWeightKg && (
              <p className={errorClass}>{errors.targetWeightKg.message}</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Lifestyle and diet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Help your nutritionist understand your daily habits.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Activity level *</label>

            <select className={inputClass} {...register("activityLevel")}>
              <option value="">Select activity level</option>

              {ACTIVITY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {ACTIVITY_LABELS[level]}
                </option>
              ))}
            </select>

            {errors.activityLevel && (
              <p className={errorClass}>{errors.activityLevel.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Diet type *</label>

            <select className={inputClass} {...register("dietType")}>
              <option value="">Select diet type</option>

              {DIET_TYPES.map((diet) => (
                <option key={diet} value={diet}>
                  {DIET_LABELS[diet]}
                </option>
              ))}
            </select>

            {errors.dietType && (
              <p className={errorClass}>{errors.dietType.message}</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Health and food information
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Separate multiple entries using commas.
          </p>
        </div>

        {(
          [
            ["medicalConditions", "Medical conditions", "e.g. Diabetes, PCOS"],
            ["allergies", "Allergies", "e.g. Peanuts, seafood"],
            ["dietaryRestrictions", "Dietary restrictions", "e.g. No dairy"],
            ["foodPreferences", "Food preferences", "e.g. Chicken, fruits"],
            ["dislikedFoods", "Disliked foods", "e.g. Broccoli, mushrooms"],
          ] as const
        ).map(([name, label, placeholder]) => (
          <div key={name}>
            <label className={labelClass}>{label}</label>
            <input
              type="text"
              placeholder={placeholder}
              className={inputClass}
              {...register(name)}
            />
            {errors[name] && (
              <p className={errorClass}>{errors[name].message}</p>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Daily routine
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            These details help your nutritionist understand your routine.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Meals per day</label>
            <input
              type="number"
              placeholder="e.g. 3"
              className={inputClass}
              {...register("mealsPerDay")}
            />
            {errors.mealsPerDay && (
              <p className={errorClass}>{errors.mealsPerDay.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Water (litres)</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 2.5"
              className={inputClass}
              {...register("dailyWaterIntakeLiters")}
            />
            {errors.dailyWaterIntakeLiters && (
              <p className={errorClass}>
                {errors.dailyWaterIntakeLiters.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Sleep (hours)</label>
            <input
              type="number"
              step="0.5"
              placeholder="e.g. 7"
              className={inputClass}
              {...register("averageSleepHours")}
            />
            {errors.averageSleepHours && (
              <p className={errorClass}>{errors.averageSleepHours.message}</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <label className={labelClass}>Additional notes</label>
        <textarea
          rows={4}
          placeholder="Share any additional information your nutritionist should know..."
          className={inputClass}
          {...register("additionalNotes")}
        />
        {errors.additionalNotes && (
          <p className={errorClass}>{errors.additionalNotes.message}</p>
        )}
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update health details"
              : "Submit health details"}
        </button>
      </div>
    </form>
  );
}
