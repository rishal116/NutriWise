import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { CreatePlanDayFormInput } from "@/schemas/nutritionist/plan-day/nutritionist-plan-day.schema";

import {
  PLAN_DAY_ERROR_CLASS,
  PLAN_DAY_INPUT_CLASS,
  PLAN_DAY_LABEL_CLASS,
} from "@/constants/nutritionist/plan-day/plan-day-form.constants";

interface ActivityAdditionalFieldsProps {
  register: UseFormRegister<CreatePlanDayFormInput>;
  errors: FieldErrors<CreatePlanDayFormInput>;
  index: number;
  disabled: boolean;
}

export default function ActivityAdditionalFields({
  register,
  errors,
  index,
  disabled,
}: ActivityAdditionalFieldsProps) {
  const activityErrors = errors.activities?.[index];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label
          className={PLAN_DAY_LABEL_CLASS}
          htmlFor={`activity-${index}-scheduledTime`}
        >
          Scheduled time
        </label>
        <input
          id={`activity-${index}-scheduledTime`}
          type="time"
          disabled={disabled}
          {...register(`activities.${index}.scheduledTime`)}
          className={PLAN_DAY_INPUT_CLASS}
        />
        {activityErrors?.scheduledTime && (
          <p className={PLAN_DAY_ERROR_CLASS}>
            {activityErrors.scheduledTime.message}
          </p>
        )}
      </div>

      <div className="flex items-end pb-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <input
            type="checkbox"
            disabled={disabled}
            {...register(`activities.${index}.isRequired`)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
          />
          Required activity
        </label>
      </div>

      <div>
        <label
          className={PLAN_DAY_LABEL_CLASS}
          htmlFor={`activity-${index}-description`}
        >
          Description (optional)
        </label>
        <textarea
          id={`activity-${index}-description`}
          rows={3}
          maxLength={2000}
          disabled={disabled}
          {...register(`activities.${index}.description`)}
          placeholder="Briefly describe this activity"
          className={PLAN_DAY_INPUT_CLASS}
        />
        {activityErrors?.description && (
          <p className={PLAN_DAY_ERROR_CLASS}>
            {activityErrors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          className={PLAN_DAY_LABEL_CLASS}
          htmlFor={`activity-${index}-instructions`}
        >
          Instructions (optional)
        </label>
        <textarea
          id={`activity-${index}-instructions`}
          rows={3}
          maxLength={5000}
          disabled={disabled}
          {...register(`activities.${index}.instructions`)}
          placeholder="Steps or guidance to follow"
          className={PLAN_DAY_INPUT_CLASS}
        />
        {activityErrors?.instructions && (
          <p className={PLAN_DAY_ERROR_CLASS}>
            {activityErrors.instructions.message}
          </p>
        )}
      </div>
    </div>
  );
}
