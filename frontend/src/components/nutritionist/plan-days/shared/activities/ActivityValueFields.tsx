import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { CreatePlanDayFormInput } from "@/schemas/nutritionist/plan-day/nutritionist-plan-day.schema";

import {
  PLAN_DAY_ERROR_CLASS,
  PLAN_DAY_INPUT_CLASS,
  PLAN_DAY_LABEL_CLASS,
} from "@/constants/nutritionist/plan-day/plan-day-form.constants";

interface ActivityValueFieldsProps {
  register: UseFormRegister<CreatePlanDayFormInput>;
  errors: FieldErrors<CreatePlanDayFormInput>;
  index: number;
  showTargetAndUnit: boolean;
  showEstimatedDuration: boolean;
  disabled: boolean;
}

export default function ActivityValueFields({
  register,
  errors,
  index,
  showTargetAndUnit,
  showEstimatedDuration,
  disabled,
}: ActivityValueFieldsProps) {
  const activityErrors = errors.activities?.[index];

  if (!showTargetAndUnit && !showEstimatedDuration) {
    return null;
  }

  return (
    <>
      {showTargetAndUnit && (
        <>
          <div>
            <label
              className={PLAN_DAY_LABEL_CLASS}
              htmlFor={`activity-${index}-targetValue`}
            >
              Target value
            </label>
            <input
              id={`activity-${index}-targetValue`}
              type="text"
              inputMode="decimal"
              disabled={disabled}
              {...register(`activities.${index}.targetValue`, {
                setValueAs: (value: string) =>
                  value === "" ? undefined : Number(value),
                onChange: (event) => {
                  event.target.value = event.target.value.replace(
                    /[^0-9.]/g,
                    "",
                  );
                },
              })}
              placeholder="30"
              className={PLAN_DAY_INPUT_CLASS}
            />
            {activityErrors?.targetValue && (
              <p className={PLAN_DAY_ERROR_CLASS}>
                {activityErrors.targetValue.message}
              </p>
            )}
          </div>

          <div>
            <label
              className={PLAN_DAY_LABEL_CLASS}
              htmlFor={`activity-${index}-unit`}
            >
              Unit
            </label>
            <input
              id={`activity-${index}-unit`}
              maxLength={30}
              disabled={disabled}
              {...register(`activities.${index}.unit`)}
              placeholder="ml, reps, minutes..."
              className={PLAN_DAY_INPUT_CLASS}
            />
            {activityErrors?.unit && (
              <p className={PLAN_DAY_ERROR_CLASS}>
                {activityErrors.unit.message}
              </p>
            )}
          </div>
        </>
      )}

      {showEstimatedDuration && (
        <div>
          <label
            className={PLAN_DAY_LABEL_CLASS}
            htmlFor={`activity-${index}-duration`}
          >
            Estimated duration (minutes)
          </label>
          <input
            id={`activity-${index}-duration`}
            type="text"
            inputMode="numeric"
            disabled={disabled}
            {...register(`activities.${index}.estimatedDurationMinutes`, {
              setValueAs: (value: string) =>
                value === "" ? undefined : Number(value),
              onChange: (event) => {
                event.target.value = event.target.value.replace(/\D/g, "");
              },
            })}
            placeholder="Optional"
            className={PLAN_DAY_INPUT_CLASS}
          />
          {activityErrors?.estimatedDurationMinutes && (
            <p className={PLAN_DAY_ERROR_CLASS}>
              {activityErrors.estimatedDurationMinutes.message}
            </p>
          )}
        </div>
      )}
    </>
  );
}
