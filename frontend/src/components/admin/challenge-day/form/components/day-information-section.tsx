
"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";

import type { FormInput } from "../validation/challenge-day-form.schema";
import {
  errorClass,
  inputClass,
  labelClass,
} from "../style/challenge-day-form.styles";

interface DayInformationSectionProps {
  register: UseFormRegister<FormInput>;
  errors: FieldErrors<FormInput>;
  mode: "create" | "edit";
  saving: boolean;
  durationLoaded: boolean;
  maxDurationDays: number | null;
  titleLength: number;
  descriptionLength: number;
}

export default function DayInformationSection({
  register,
  errors,
  mode,
  saving,
  durationLoaded,
  maxDurationDays,
  titleLength,
  descriptionLength,
}: DayInformationSectionProps) {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface shadow-sm shadow-admin-text/5">
      <div className="border-b border-admin-border px-5 py-4 sm:px-6">
        <h2 className="text-base font-bold text-admin-text">
          Day Information
        </h2>

        <p className="mt-1 text-xs text-admin-muted">
          Set the basic information participants will see for this day.
        </p>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <label htmlFor="dayNumber" className={labelClass}>
            Day Number
          </label>

          <input
            id="dayNumber"
            type="number"
            min={1}
            max={
              mode === "create" ? (maxDurationDays ?? undefined) : undefined
            }
            disabled={
              mode === "edit" || saving || (mode === "create" && !durationLoaded)
            }
            {...register("dayNumber", { valueAsNumber: true })}
            className={`${inputClass} sm:max-w-[180px]`}
          />

          <p className="mt-1.5 text-[11px] text-admin-muted">
            {mode === "edit"
              ? "The day number stays fixed after creation."
              : !durationLoaded
                ? "Loading challenge duration..."
                : maxDurationDays !== null
                  ? `Allowed range: Day 1 to Day ${maxDurationDays}.`
                  : "Challenge duration unavailable. Open challenge details first."}
          </p>

          {errors.dayNumber && (
            <p className={errorClass}>{errors.dayNumber.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="title" className={labelClass}>
              Day Title
            </label>

            <span className="text-[11px] font-medium text-admin-muted">
              {titleLength}/150
            </span>
          </div>

          <input
            id="title"
            maxLength={150}
            disabled={saving}
            {...register("title")}
            placeholder="Morning Movement"
            className={inputClass}
          />

          {errors.title && (
            <p className={errorClass}>{errors.title.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>

            <span className="text-[11px] font-medium text-admin-muted">
              {descriptionLength}/2000
            </span>
          </div>

          <textarea
            id="description"
            rows={4}
            maxLength={2000}
            disabled={saving}
            {...register("description")}
            placeholder="Describe what participants should focus on during this day..."
            className={`${inputClass} resize-none`}
          />

          {errors.description && (
            <p className={errorClass}>{errors.description.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
