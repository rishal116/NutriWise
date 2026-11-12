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
}

export default function PlanDayInformationFields({
  register,
  errors,
  disabled,
  showDayNumber = false,
}: PlanDayInformationFieldsProps) {
  return (
    <section className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-bold text-slate-900">
          Day Information
        </h2>
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
            step={1}
            disabled={disabled}
            {...register("dayNumber", { valueAsNumber: true })}
            className={PLAN_DAY_INPUT_CLASS}
            placeholder="1"
          />
          {errors.dayNumber && (
            <p className={PLAN_DAY_ERROR_CLASS}>
              {errors.dayNumber.message}
            </p>
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
          <p className={PLAN_DAY_ERROR_CLASS}>
            {errors.description.message}
          </p>
        )}
      </div>
    </section>
  );
}