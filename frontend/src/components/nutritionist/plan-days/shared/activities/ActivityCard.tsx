import { GripVertical } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import type {
  CreatePlanDayFormInput,
  CreatePlanDayFormValues,
} from "@/schemas/nutritionist/plan-day/nutritionist-plan-day.schema";

import type { ProgramActivityCategory } from "@/constants/user/program/program-activity-category.constants";
import type { ActivityValueType } from "@/constants/user/program/activity-value-type.constants";

import {
  NEEDS_ESTIMATED_DURATION,
  NEEDS_TARGET_AND_UNIT,
} from "@/constants/nutritionist/plan-day/plan-day-form.constants";

import ActivityBasicFields from "./ActivityBasicFields";
import ActivityValueFields from "./ActivityValueFields";
import ActivityAdditionalFields from "./ActivityAdditionalFields";
import ActivityActions from "./ActivityActions";

interface ActivityCardProps {
  control: Control<CreatePlanDayFormInput, unknown, CreatePlanDayFormValues>;
  register: UseFormRegister<CreatePlanDayFormInput>;
  errors: FieldErrors<CreatePlanDayFormInput>;
  index: number;
  total: number;
  valueType: ActivityValueType | undefined;
  disabled: boolean;
  onCategoryChange: (index: number, category: ProgramActivityCategory) => void;
  onValueTypeChange: (index: number, valueType: ActivityValueType) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export default function ActivityCard({
  control,
  register,
  errors,
  index,
  total,
  valueType,
  disabled,
  onCategoryChange,
  onValueTypeChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: ActivityCardProps) {
  const showTargetAndUnit =
    valueType !== undefined && NEEDS_TARGET_AND_UNIT.includes(valueType);

  const showEstimatedDuration =
    valueType !== undefined && NEEDS_ESTIMATED_DURATION.includes(valueType);

  return (
    <article className="space-y-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 flex-col items-center gap-1 pt-2 text-slate-300">
          <GripVertical size={16} />
          <span className="text-[10px] font-bold text-slate-400">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <ActivityBasicFields
            control={control}
            register={register}
            errors={errors}
            index={index}
            disabled={disabled}
            onCategoryChange={onCategoryChange}
            onValueTypeChange={onValueTypeChange}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ActivityValueFields
              register={register}
              errors={errors}
              index={index}
              showTargetAndUnit={showTargetAndUnit}
              showEstimatedDuration={showEstimatedDuration}
              disabled={disabled}
            />
          </div>
        </div>

        <ActivityActions
          index={index}
          total={total}
          disabled={disabled}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onRemove={onRemove}
        />
      </div>

      <ActivityAdditionalFields
        register={register}
        errors={errors}
        index={index}
        disabled={disabled}
      />
    </article>
  );
}
