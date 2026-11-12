import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import type {
  CreatePlanDayFormInput,
  CreatePlanDayFormValues,
} from "@/schemas/nutritionist/plan-day/nutritionist-plan-day.schema";

import {
  PROGRAM_ACTIVITY_CATEGORIES,
  type ProgramActivityCategory,
} from "@/constants/user/program/program-activity-category.constants";

import {
  ACTIVITY_VALUE_TYPES,
  type ActivityValueType,
} from "@/constants/user/program/activity-value-type.constants";

import {
  CATEGORY_LABELS,
  VALUE_TYPE_LABELS,
  PLAN_DAY_ERROR_CLASS,
  PLAN_DAY_INPUT_CLASS,
  PLAN_DAY_LABEL_CLASS,
} from "@/constants/nutritionist/plan-day/plan-day-form.constants";

import ActivitySelect from "./ActivitySelect";

interface ActivityBasicFieldsProps {
  control: Control<CreatePlanDayFormInput, unknown, CreatePlanDayFormValues>;
  register: UseFormRegister<CreatePlanDayFormInput>;
  errors: FieldErrors<CreatePlanDayFormInput>;
  index: number;
  disabled: boolean;
  onCategoryChange: (index: number, category: ProgramActivityCategory) => void;
  onValueTypeChange: (index: number, valueType: ActivityValueType) => void;
}

const CATEGORY_OPTIONS = PROGRAM_ACTIVITY_CATEGORIES.map((category) => ({
  value: category,
  label: CATEGORY_LABELS[category],
}));

const VALUE_TYPE_OPTIONS = ACTIVITY_VALUE_TYPES.map((valueType) => ({
  value: valueType,
  label: VALUE_TYPE_LABELS[valueType],
}));

export default function ActivityBasicFields({
  control,
  register,
  errors,
  index,
  disabled,
  onCategoryChange,
  onValueTypeChange,
}: ActivityBasicFieldsProps) {
  const activityErrors = errors.activities?.[index];

  return (
    <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label
          className={PLAN_DAY_LABEL_CLASS}
          htmlFor={`activity-${index}-category`}
        >
          Category
        </label>

        <Controller
          control={control}
          name={`activities.${index}.category`}
          render={({ field }) => (
            <ActivitySelect
              id={`activity-${index}-category`}
              value={field.value}
              options={CATEGORY_OPTIONS}
              disabled={disabled}
              placeholder="Select category"
              onChange={(category) => {
                field.onChange(category);
                onCategoryChange(index, category);
              }}
            />
          )}
        />

        {activityErrors?.category && (
          <p className={PLAN_DAY_ERROR_CLASS}>
            {activityErrors.category.message}
          </p>
        )}
      </div>

      <div>
        <label
          className={PLAN_DAY_LABEL_CLASS}
          htmlFor={`activity-${index}-title`}
        >
          Activity title
        </label>

        <input
          id={`activity-${index}-title`}
          maxLength={150}
          disabled={disabled}
          {...register(`activities.${index}.title`)}
          placeholder="Morning walk"
          className={PLAN_DAY_INPUT_CLASS}
        />

        {activityErrors?.title && (
          <p className={PLAN_DAY_ERROR_CLASS}>{activityErrors.title.message}</p>
        )}
      </div>

      <div>
        <label
          className={PLAN_DAY_LABEL_CLASS}
          htmlFor={`activity-${index}-valueType`}
        >
          Response type
        </label>

        <Controller
          control={control}
          name={`activities.${index}.valueType`}
          render={({ field }) => (
            <ActivitySelect
              id={`activity-${index}-valueType`}
              value={field.value}
              options={VALUE_TYPE_OPTIONS}
              disabled={disabled}
              placeholder="Select response type"
              onChange={(valueType) => {
                field.onChange(valueType);
                onValueTypeChange(index, valueType);
              }}
            />
          )}
        />

        {activityErrors?.valueType && (
          <p className={PLAN_DAY_ERROR_CLASS}>
            {activityErrors.valueType.message}
          </p>
        )}
      </div>
    </div>
  );
}
