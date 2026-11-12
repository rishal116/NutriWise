import { Plus } from "lucide-react";

import type {
  Control,
  FieldErrors,
  UseFieldArrayReturn,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

import type {
  CreatePlanDayFormInput,
  CreatePlanDayFormValues,
} from "@/schemas/nutritionist/plan-day/nutritionist-plan-day.schema";

import type { ProgramActivityCategory } from "@/constants/user/program/program-activity-category.constants";
import type { ActivityValueType } from "@/constants/user/program/activity-value-type.constants";

import { PLAN_DAY_ERROR_CLASS } from "@/constants/nutritionist/plan-day/plan-day-form.constants";

import ActivityCard from "./ActivityCard";
import { createEmptyActivity } from "./activity.utils";
import PlanDayEmptyActivities from "../ui/PlanDayEmptyActivities";

interface ActivityListProps {
  control: Control<CreatePlanDayFormInput, unknown, CreatePlanDayFormValues>;
  register: UseFormRegister<CreatePlanDayFormInput>;
  watch: UseFormWatch<CreatePlanDayFormInput>;
  errors: FieldErrors<CreatePlanDayFormInput>;
  fieldArray: UseFieldArrayReturn<CreatePlanDayFormInput, "activities">;
  disabled: boolean;
  onCategoryChange: (index: number, category: ProgramActivityCategory) => void;
  onValueTypeChange: (index: number, valueType: ActivityValueType) => void;
}

export default function ActivityList({
  control,
  register,
  watch,
  errors,
  fieldArray,
  disabled,
  onCategoryChange,
  onValueTypeChange,
}: ActivityListProps) {
  const { fields, append, remove, move } = fieldArray;

  const addActivity = () => {
    if (disabled) {
      return;
    }

    append(createEmptyActivity(fields.length));
  };

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-bold text-slate-900">Activities</h2>

          <p className="mt-1 text-xs text-slate-500">
            Add and arrange the activities scheduled for this day.
          </p>
        </div>

        <button
          type="button"
          onClick={addActivity}
          disabled={disabled}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          Add activity
        </button>
      </div>

      {errors.activities?.root?.message && (
        <p className={PLAN_DAY_ERROR_CLASS}>{errors.activities.root.message}</p>
      )}

      {typeof errors.activities?.message === "string" && (
        <p className={PLAN_DAY_ERROR_CLASS}>{errors.activities.message}</p>
      )}

      {fields.length === 0 ? (
        <PlanDayEmptyActivities disabled={disabled} onAdd={addActivity} />
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <ActivityCard
              key={field.id}
              control={control}
              register={register}
              errors={errors}
              index={index}
              total={fields.length}
              valueType={watch(`activities.${index}.valueType`)}
              disabled={disabled}
              onCategoryChange={onCategoryChange}
              onValueTypeChange={onValueTypeChange}
              onMoveUp={() => move(index, index - 1)}
              onMoveDown={() => move(index, index + 1)}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
