
import type { PlanActivityFormInput } from "@/schemas/nutritionist/plan-day/nutritionist-plan-day.schema";
import type { ActivityValueType } from "@/constants/user/program/activity-value-type.constants";

import {
  NEEDS_ESTIMATED_DURATION,
  NEEDS_TARGET_AND_UNIT,
} from "@/constants/nutritionist/plan-day/plan-day-form.constants";

export function createEmptyActivity(order: number): PlanActivityFormInput {
  return {
    category: undefined,
    title: "",
    description: "",
    instructions: "",
    valueType: undefined,
    targetValue: undefined,
    unit: "",
    estimatedDurationMinutes: undefined,
    scheduledTime: "",
    isRequired: true,
    order,
  };
}

export function getActivityFieldsToClear(valueType: ActivityValueType) {
  return {
    clearTargetAndUnit: !NEEDS_TARGET_AND_UNIT.includes(valueType),
    clearEstimatedDuration: !NEEDS_ESTIMATED_DURATION.includes(valueType),
  };
}
