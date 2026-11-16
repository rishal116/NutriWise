
import { CalendarDays, Pencil, ShieldCheck } from "lucide-react";

import type { ActivityLevel } from "@/constants/user/health/activity-level.constants";
import type { DietType } from "@/constants/user/health/diet-type.constants";
import type { ProgramHealthResponseDTO } from "@/dtos/user/program-health/program-health-response.dto";

interface ProgramHealthSummaryProps {
  data: ProgramHealthResponseDTO;
  onEdit: () => void;
}

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary",
  lightly_active: "Lightly active",
  moderately_active: "Moderately active",
  active: "Active",
  very_active: "Very active",
};

const DIET_LABELS: Record<DietType, string> = {
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

export default function ProgramHealthSummary({
  data,
  onEdit,
}: ProgramHealthSummaryProps) {
  const items = [
    {
      label: "Height",
      value: `${data.heightCm} cm`,
    },
    {
      label: "Current weight",
      value: `${data.currentWeightKg} kg`,
    },
    {
      label: "Target weight",
      value:
        data.targetWeightKg !== undefined
          ? `${data.targetWeightKg} kg`
          : "Not provided",
    },
    {
      label: "Activity level",
      value: ACTIVITY_LABELS[data.activityLevel],
    },
    {
      label: "Diet type",
      value: DIET_LABELS[data.dietType],
    },
    {
      label: "Meals per day",
      value: data.mealsPerDay?.toString() ?? "Not provided",
    },
    {
      label: "Water intake",
      value:
        data.dailyWaterIntakeLiters !== undefined
          ? `${data.dailyWaterIntakeLiters} litres`
          : "Not provided",
    },
    {
      label: "Sleep",
      value:
        data.averageSleepHours !== undefined
          ? `${data.averageSleepHours} hours`
          : "Not provided",
    },
  ];

  const lists = [
    { label: "Medical conditions", values: data.medicalConditions },
    { label: "Allergies", values: data.allergies },
    { label: "Dietary restrictions", values: data.dietaryRestrictions },
    { label: "Food preferences", values: data.foodPreferences },
    { label: "Disliked foods", values: data.dislikedFoods },
  ];

  const submittedDate = new Date(data.submittedAt);
  const formattedSubmittedDate = Number.isNaN(submittedDate.getTime())
    ? "Date unavailable"
    : submittedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <ShieldCheck size={22} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-gray-900">
                Program health information
              </h3>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Submitted
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <CalendarDays size={14} />
              <span>Submitted {formattedSubmittedDate}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <Pencil size={15} />
          Update details
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl bg-gray-50 p-4"
          >
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="mt-1 font-semibold text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {lists.map((item) => (
          <div key={item.label}>
            <h4 className="text-sm font-semibold text-gray-800">
              {item.label}
            </h4>

            <div className="mt-2 flex flex-wrap gap-2">
              {item.values.length > 0 ? (
                item.values.map((value, index) => (
                  <span
                    key={`${item.label}-${value}-${index}`}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700"
                  >
                    {value}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400">
                  Not provided
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {data.additionalNotes && (
        <div className="mt-6 rounded-xl bg-amber-50 p-4">
          <h4 className="text-sm font-semibold text-gray-800">
            Additional notes
          </h4>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
            {data.additionalNotes}
          </p>
        </div>
      )}
    </div>
  );
}
