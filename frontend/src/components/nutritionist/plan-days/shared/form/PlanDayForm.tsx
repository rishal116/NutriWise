import type { ReactNode, FormEventHandler } from "react";
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

import PlanDayInformationFields from "./PlanDayInformationFields";
import ActivityList from "../activities/ActivityList";

interface PlanDayFormProps {
  control: Control<
    CreatePlanDayFormInput,
    unknown,
    CreatePlanDayFormValues
  >;
  register: UseFormRegister<CreatePlanDayFormInput>;
  watch: UseFormWatch<CreatePlanDayFormInput>;
  errors: FieldErrors<CreatePlanDayFormInput>;
  fieldArray: UseFieldArrayReturn<CreatePlanDayFormInput, "activities">;
  submitting: boolean;
  showDayNumber?: boolean;
  onCategoryChange: (
    index: number,
    category: ProgramActivityCategory,
  ) => void;
  onValueTypeChange: (
    index: number,
    valueType: ActivityValueType,
  ) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  actions: ReactNode;
}

export default function PlanDayForm({
  control,
  register,
  watch,
  errors,
  fieldArray,
  submitting,
  showDayNumber = false,
  onCategoryChange,
  onValueTypeChange,
  onSubmit,
  actions,
}: PlanDayFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <PlanDayInformationFields
        register={register}
        errors={errors}
        disabled={submitting}
        showDayNumber={showDayNumber}
      />

      <ActivityList
        control={control}
        register={register}
        watch={watch}
        errors={errors}
        fieldArray={fieldArray}
        disabled={submitting}
        onCategoryChange={onCategoryChange}
        onValueTypeChange={onValueTypeChange}
      />

      {actions}
    </form>
  );
}