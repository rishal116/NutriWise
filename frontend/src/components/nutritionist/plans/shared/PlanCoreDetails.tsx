import { CalendarDays } from "lucide-react";
import type { ChangeEvent } from "react";

import { Input, SectionCard, Select, Textarea } from "./FormFields";

import { PLAN_DURATION_SUGGESTIONS } from "@/constants/nutritionist/plan/create-plan.constants";

import type { Specialization } from "@/types/nutritionist.types";
import type {
  CreatePlanForm,
  CreatePlanFormErrors,
  PlanOption,
} from "@/types/nutritionist/plan/create-plan-form.types";

interface PlanCoreDetailsProps {
  form: CreatePlanForm;
  errors: CreatePlanFormErrors;
  categories: PlanOption[];
  loadingCategories: boolean;
  onChange: <K extends keyof CreatePlanForm>(
    field: K,
    value: CreatePlanForm[K],
  ) => void;
}

export default function PlanCoreDetails({
  form,
  errors,
  categories,
  loadingCategories,
  onChange,
}: PlanCoreDetailsProps) {
  return (
    <SectionCard icon={CalendarDays} title="Core Details">
      <div className="space-y-5">
        <Input
          label="Plan Title"
          placeholder="e.g. Healthy Weight Management"
          value={form.title}
          error={errors.title}
          onChange={(value) => onChange("title", value)}
        />

        <Select
          label="Specialization"
          value={form.specialization}
          options={categories}
          disabled={loadingCategories}
          error={errors.specialization}
          onChange={(value) =>
            onChange("specialization", value as Specialization)
          }
        />

        <div>
          <label
            htmlFor="durationDays"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Plan Duration
          </label>

          <div className="relative">
            <input
              id="durationDays"
              type="text"
              inputMode="numeric"
              minLength={1}
              maxLength={3}
              value={form.durationDays}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const value = event.target.value;

                if (/^\d{0,3}$/.test(value)) {
                  onChange("durationDays", value);
                }
              }}
              placeholder="Enter days (1–365)"
              aria-invalid={Boolean(errors.durationDays)}
              className={`w-full rounded-xl border bg-slate-50 px-4 py-3 pr-16 text-sm outline-none transition focus:ring-2 ${
                errors.durationDays
                  ? "border-red-300 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              days
            </span>
          </div>

          {errors.durationDays && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.durationDays}
            </p>
          )}

          <div className="mt-3">
            <p className="mb-2 text-xs font-semibold text-slate-500">
              Suggested durations
            </p>

            <div className="flex flex-wrap gap-2">
              {PLAN_DURATION_SUGGESTIONS.map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => onChange("durationDays", String(days))}
                  aria-pressed={form.durationDays === String(days)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    form.durationDays === String(days)
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                  }`}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>
        </div>

        <Textarea
          label="Description"
          placeholder="Describe the plan, its goals, and what clients can expect..."
          value={form.description}
          error={errors.description}
          onChange={(value) => onChange("description", value)}
        />
      </div>
    </SectionCard>
  );
}
