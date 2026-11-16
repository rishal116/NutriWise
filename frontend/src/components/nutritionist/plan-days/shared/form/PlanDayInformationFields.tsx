import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { CreatePlanDayFormInput } from "@/schemas/nutritionist/plan-day/nutritionist-plan-day.schema";

import {
  PLAN_DAY_ERROR_CLASS,
  PLAN_DAY_INPUT_CLASS,
  PLAN_DAY_LABEL_CLASS,
} from "@/constants/nutritionist/plan-day/plan-day-form.constants";

interface PlanDayInformationFieldsProps {
  register: UseFormRegister<CreatePlanDayFormInput>;
  errors: FieldErrors<CreatePlanDayFormInput>;
  disabled: boolean;
  showDayNumber?: boolean;
  durationDays?: number | null;
}

export default function PlanDayInformationFields({
  register,
  errors,
  disabled,
  showDayNumber = false,
  durationDays,
}: PlanDayInformationFieldsProps) {
  const hasDuration = durationDays != null && durationDays > 0;

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-bold text-slate-900">Day Information</h2>
        <p className="mt-1 text-xs text-slate-500">
          Provide a title and description for this day.
        </p>
      </div>

      {showDayNumber && (
        <div>
          <label htmlFor="dayNumber" className={PLAN_DAY_LABEL_CLASS}>
            Day number
          </label>

          <input
            id="dayNumber"
            type="number"
            min={1}
            max={hasDuration ? durationDays : undefined}
            step={1}
            disabled={disabled || !hasDuration}
            {...register("dayNumber", { valueAsNumber: true })}
            onKeyDown={(event) => {
              if (["e", "E", "+", "-", "."].includes(event.key)) {
                event.preventDefault();
              }
            }}
            onChange={(event) => {
              const value = event.target.value;

              if (value === "") {
                event.target.value = "";
                return;
              }

              const number = Number(value);

              if (
                !Number.isInteger(number) ||
                number < 1 ||
                (hasDuration && number > durationDays)
              ) {
                event.target.value = "";
              }
            }}
            className={PLAN_DAY_INPUT_CLASS}
            placeholder={
              hasDuration
                ? `Enter 1 to ${durationDays}`
                : "Loading plan duration..."
            }
          />

          <p className="mt-1 text-xs text-slate-500">
            {hasDuration
              ? `Enter a day number between 1 and ${durationDays}.`
              : "Plan duration is unavailable. Please revisit the plan details."}
          </p>

          {errors.dayNumber && (
            <p className={PLAN_DAY_ERROR_CLASS}>{errors.dayNumber.message}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="dayTitle" className={PLAN_DAY_LABEL_CLASS}>
          Day title (optional)
        </label>

        <input
          id="dayTitle"
          type="text"
          maxLength={120}
          disabled={disabled}
          {...register("title")}
          className={PLAN_DAY_INPUT_CLASS}
          placeholder="Healthy morning routine"
        />

        {errors.title && (
          <p className={PLAN_DAY_ERROR_CLASS}>{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="dayDescription" className={PLAN_DAY_LABEL_CLASS}>
          Day description (optional)
        </label>

        <textarea
          id="dayDescription"
          rows={3}
          maxLength={1000}
          disabled={disabled}
          {...register("description")}
          className={PLAN_DAY_INPUT_CLASS}
          placeholder="Describe the focus and goals for this day."
        />

        {errors.description && (
          <p className={PLAN_DAY_ERROR_CLASS}>{errors.description.message}</p>
        )}
      </div>
    </section>
  );
}
