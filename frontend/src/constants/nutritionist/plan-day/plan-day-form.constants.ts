import type { ProgramActivityCategory } from "@/constants/user/program/program-activity-category.constants";
import type { ActivityValueType } from "@/constants/user/program/activity-value-type.constants";

export const NEEDS_TARGET_AND_UNIT: ActivityValueType[] = [
  "number",
  "duration",
];

export const NEEDS_ESTIMATED_DURATION: ActivityValueType[] = [
  "boolean",
  "duration",
];

export const CATEGORY_DEFAULT_VALUE_TYPE: Record<
  ProgramActivityCategory,
  ActivityValueType
> = {
  meal: "boolean",
  exercise: "duration",
  habit: "boolean",
  water: "number",
  supplement: "boolean",
  meditation: "duration",
  sleep: "duration",
  reading: "boolean",
  appointment: "boolean",
  measurement: "number",
  task: "boolean",
};

export const CATEGORY_VALUE_TYPE_OPTIONS: Record<
  ProgramActivityCategory,
  ActivityValueType[]
> = {
  meal: ["boolean", "text", "photo"],
  exercise: ["boolean", "duration", "number", "photo"],
  habit: ["boolean", "text"],
  water: ["number"],
  supplement: ["boolean", "number", "photo"],
  meditation: ["boolean", "duration"],
  sleep: ["duration", "number"],
  reading: ["boolean", "duration", "text", "photo"],
  appointment: ["boolean", "text"],
  measurement: ["number", "photo"],
  task: ["boolean", "text", "photo"],
};

export const CATEGORY_LABELS: Record<ProgramActivityCategory, string> = {
  meal: "Meal",
  exercise: "Exercise",
  habit: "Habit",
  water: "Water",
  supplement: "Supplement",
  meditation: "Meditation",
  sleep: "Sleep",
  reading: "Reading",
  appointment: "Appointment",
  measurement: "Measurement",
  task: "Task",
};

export const VALUE_TYPE_LABELS: Record<ActivityValueType, string> = {
  boolean: "Yes / No",
  number: "Number",
  duration: "Duration",
  photo: "Photo",
  text: "Text",
};

export const PLAN_DAY_INPUT_CLASS =
  "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";

export const PLAN_DAY_LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-wider text-slate-500";

export const PLAN_DAY_ERROR_CLASS =
  "mt-1 text-[11px] font-medium text-rose-600";
